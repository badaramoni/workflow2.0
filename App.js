import React, { useState } from 'react';
import Toolbar from './components/Toolbar';
import NavigationBar from './components/NavigationBar';
import EditorWindow from './components/EditorWindow';
import ToolWindowBar from './components/ToolWindowBar';
import ToolWindows from './components/ToolWindows';
import StatusBar from './components/StatusBar';
import Directory from './components/Directory';
import File from './components/File';
import { fetchRepoContent, fetchFileContent } from './services/fetchService';
import { themes } from './constants/themes';


const App = () => {
  const [url, setUrl] = useState('');
  const [projectType, setProjectType] = useState(null);
  const [fileStructure, setFileStructure] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openedFileContent, setOpenedFileContent] = useState(null);

  const theme = themes[projectType] || {
    backgroundColor: 'white',
    color: 'black'
  };

  const recognizeProject = async () => {
    setLoading(true);
    const result = await fetchRepoContent(url);

    if (result.error) {
      setProjectType(result.error);
      setLoading(false);
      return;
    }

    const fileNames = result.files.map(file => file.name);

    if (fileNames.includes("build.gradle")) {
      setProjectType("Android");
    } else if (fileNames.includes(".xcodeproj")) {
      setProjectType("iOS");
    } else if (fileNames.includes("index.html") || fileNames.includes("package.json")) {
      setProjectType("Web");
    } else {
      setProjectType("Unknown");
    }

    setFileStructure(result.files);
    setLoading(false);
  };

  const [searchQuery, setSearchQuery] = useState(''); // File search
  const [openTabs, setOpenTabs] = useState([]); // Tabs for open files

  const filteredFileStructure = fileStructure.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState(null);

  const openInTab = (fileName, fileContent) => {
    if (!openTabs.some(tab => tab.name === fileName)) {
      setOpenTabs([...openTabs, { name: fileName, content: fileContent }]);
    }
    setActiveTab(fileName); // Set this file as the active tab
  };

  const closeTab = (fileName) => {
    const newTabs = openTabs.filter(tab => tab.name !== fileName);
    setOpenTabs(newTabs);
    if (activeTab === fileName && newTabs.length > 0) {
      setActiveTab(newTabs[0].name);
    } else if (newTabs.length === 0) {
      setActiveTab(null);
      setOpenedFileContent(null);
    }
  };

  const createNewFile = () => {
    const fileName = prompt("Enter the new file name (with extension):");
    if (fileName) {
      setFileStructure([...fileStructure, { name: fileName, type: 'file', content: '' }]);
      openInTab(fileName, '');
    }
  };

  // Function to save the entire project to local storage
  const saveProjectToLocal = () => {
    localStorage.setItem('project', JSON.stringify(fileStructure));
    alert("Project saved!");
  };

  // Function to load the project from local storage
  const loadProjectFromLocal = () => {
    const savedProject = JSON.parse(localStorage.getItem('project'));
    if (savedProject) {
      setFileStructure(savedProject);
    } else {
      alert("No saved project found.");
    }
  };

   return (
    <div style={{ ...theme, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <ToolWindowBar />
      <div style={{ flex: 1, display: 'flex' }}>
         <NavigationBar>
                {/* Button to Create New File */}
                <button onClick={createNewFile}>Create New File</button>
                
                {/* Button to Save Project to Local */}
                <button onClick={saveProjectToLocal}>Save Project</button>
                
                {/* Button to Load Project from Local */}
                <button onClick={loadProjectFromLocal}>Load Project</button>
                
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter GitHub Repo URL"
                />
                <button onClick={recognizeProject} disabled={loading}>
                    {loading ? "Loading..." : "Recognize Project"}
                </button>
                {projectType && <p>Project Type: {projectType}</p>}
                <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files..."
                />
                {filteredFileStructure.length > 0 && (
                    <div>
                        <h3>File Structure:</h3>
                        {filteredFileStructure.map(item => (
                            item.type === 'dir'
                                ? <Directory key={item.name} name={item.name} repoUrl={url} setOpenedFileContent={openInTab} />
                                : <File key={item.name} name={item.name} repoUrl={url} path={item.path} setOpenedFileContent={openInTab} />
                        ))}
                    </div>
                )}
            </NavigationBar>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
            {openTabs.map(tab => (
              <div key={tab.name} style={{ padding: '5px 10px', cursor: 'pointer', background: activeTab === tab.name ? '#444' : '#333' }}>
                <span onClick={() => setActiveTab(tab.name)}>{tab.name}</span>
                <span onClick={() => closeTab(tab.name)} style={{ marginLeft: 5, cursor: 'pointer' }}>✖</span>
              </div>
            ))}
          </div>
          {activeTab && (
            <EditorWindow content={openTabs.find(tab => tab.name === activeTab).content} />
          )}
        </div>
        <ToolWindows />
      </div>
      <StatusBar />
    </div>
  );
};

export default App;