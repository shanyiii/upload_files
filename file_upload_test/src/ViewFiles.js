import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ViewFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  // 跳轉到登入頁面
  const goToAdminLogin = () => {
    navigate('/');
  };

  useEffect(() => {
    setUser(sessionStorage.getItem('admin_account'));
    if (!user) {
      alert("請先登入");
      goToAdminLogin();
    }
    // 向 Flask API 請求檔案清單
    axios.get('http://localhost:5000/api/files')
      .then(response => setFiles(response.data))
      .catch(error => console.error('無法獲取檔案清單：', error));
  }, []);

  // 登出功能
  const handleLogout = () => {
    sessionStorage.removeItem('admin_account');
    alert("登出成功");
    goToAdminLogin();
  }

  // 處理檔案的函數
  const handleProcessFile = (filename) => {
    axios.post('http://localhost:5000/api/process-file', { filename })
      .then(response => alert(response.data.message))
      .catch(error => console.error('檔案處理失敗:', error));
  };

  // 處理文件選擇
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 將文件傳送至後端
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("請選擇文件後再上傳");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // 使用 axios 傳送文件至後端
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("上傳成功：", response.data);
    } catch (error) {
      console.error("上傳失敗：", error);
    }
  };

  return (
    <div>
      <p>Hello {user}</p>
      <button onClick={handleLogout}>登出</button>
      <h1>上傳本地檔案</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>上傳</button>
      <br/>
      <br/>
      <h1>顯示所有檔案</h1>
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
