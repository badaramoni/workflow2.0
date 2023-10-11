import React, { useState } from 'react';
import File from './File';
import { fetchRepoContent } from '../services/fetchService';

function Directory({ name, repoUrl, path = "", setOpenedFileContent }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contents, setContents] = useState([]);
  const directoryPath = path ? `${path}/${name}` : name;

  const toggleOpen = async () => {
    if (!isOpen && contents.length === 0) {
      const result = await fetchRepoContent(repoUrl, directoryPath);
      if (result.files) {
        setContents(result.files);
      }
    }
    setIsOpen(prev => !prev);
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <div onClick={toggleOpen}>
        📁 {name}
      </div>
      {isOpen && contents.map(item => (
        item.type === 'dir'
          ? <Directory key={item.name} name={item.name} repoUrl={repoUrl} path={directoryPath} setOpenedFileContent={setOpenedFileContent} />
          : <File key={item.name} name={item.name} repoUrl={repoUrl} path={item.path} setOpenedFileContent={setOpenedFileContent} />
      ))}
    </div>
  );
}

export default Directory;
