import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewFiles() {
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  const goToFileUpload = () => {
    navigate('/fileUpload');
  };

  useEffect(() => {
    // 向 Flask API 請求檔案清單
    axios.get('http://localhost:5000/api/files')
      .then(response => setFiles(response.data))
      .catch(error => console.error('無法獲取檔案清單：', error));
  }, []);

  // 處理檔案的函數
  const handleProcessFile = (filename) => {
    axios.post('http://localhost:5000/api/process-file', { filename })
      .then(response => alert(response.data.message))
      .catch(error => console.error('檔案處理失敗:', error));
  };

  return (
    <div>
      <h1>顯示伺服器上的本地檔案</h1>
      <button onClick={goToFileUpload}>前往檔案上傳</button>
      <br/>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <span>{file}</span>
            <button onClick={() => handleProcessFile(file)}>
              刪除檔案
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewFiles;
