import React from 'react';
import { fetchFileContent } from '../services/fetchService';

function File({ name, repoUrl, path, setOpenedFileContent }) {
  const openFile = async () => {
    const result = await fetchFileContent(repoUrl, path);
    if (result && !result.error) {
      setOpenedFileContent(name, result.content);
    }
  };

  return (
    <div onClick={openFile}>
      {name.endsWith('.png') || name.endsWith('.jpg') ? 
        <img src={`https://raw.githubusercontent.com/${repoUrl}/master/${path}`} alt={name} style={{ width: '50px' }} />
        :
        <span>📄 {name}</span>
      }
    </div>
  );
}

export default File;
