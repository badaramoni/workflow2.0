export const fetchRepoContent = async (repoUrl, path = "") => {
    try {
      const match = repoUrl.match(/github.com\/([^\/]+)\/([^\/]+)/i);
      if (!match) {
        return { error: "Invalid GitHub URL" };
      }
      const [, username, repo] = match;
  
      const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
  
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        return { error: `Error ${response.status}: ${response.statusText}` };
      }
  
      const data = await response.json();
  
      if (data.message) {
        return { error: data.message };
      }
  
      const filesAndDirs = data.map(item => ({
        name: item.name,
        type: item.type,
        path: item.path
      }));
  
      return { files: filesAndDirs };
    } catch (error) {
      return { error: "Network or CORS issue" };
    }
  };
  
  export const fetchFileContent = async (repoUrl, path) => {
    try {
      const match = repoUrl.match(/github.com\/([^\/]+)\/([^\/]+)/i);
      if (!match) {
        return { error: "Invalid GitHub URL" };
      }
      const [, username, repo] = match;
  
      const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${path}`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        return { error: `Error ${response.status}: ${response.statusText}` };
      }
  
      const data = await response.json();
      const content = atob(data.content); // Decode the base64 encoded content
  
      return { content };
    } catch (error) {
      return { error: "Network or CORS issue" };
    }
  };
  