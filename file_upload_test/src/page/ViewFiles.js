import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

function ViewFiles() {
  const [files, setFiles] = useState([]);
  const [numberOfFiles, setNumberOfFiles] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { user, setUser } = useContext(UserContext);

  const [isUploading, setIsUploading] = useState(false); // 上傳狀態
  const [uploadProgress, setUploadProgress] = useState(0); // 上傳進度

  const navigate = useNavigate();

  // 跳轉到登入頁面
  const goToAdminRegister = () => {
    navigate('/adminRegister');
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/files')
      .then(response => {
        // console.log(response.data);
        setFiles(response.data.files);
        setNumberOfFiles(response.data.numberOfFiles);
      })
      .catch(error => console.error('無法獲取檔案清單：', error));
  }, []);

  // 登出功能
  const handleLogout = () => {
    setUser({ isLogin: false });
    alert("登出成功");
  }

  // 當 user.isLogin 設置為 false 時，跳轉到登入頁面
  useEffect(() => {
    if (!user.isLogin) {
      console.log("登出使用者：", user.userName);
      navigate('/');
    }
  }, [user.isLogin, navigate]); // 當 user.isLogin 或 navigate 改變時觸發

  // 刪除檔案
  const handleDeleteFile = async (filename) => {
    if(window.confirm("確定要刪除" + filename + "嗎？")){
      await axios.post('http://localhost:5000/api/process-file', { filename })
      .then(response => alert(response.data.message))
      .catch(error => console.error('檔案處理失敗:', error));

      window.location.reload();
    }
  };

  // 處理文件選擇
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    // 重置上傳進度
    setUploadProgress(0);
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
      setIsUploading(true);
      // 使用 axios 傳送文件至後端
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          // 計算上傳進度
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      console.log("上傳成功：", response.data);
      alert("上傳成功");
      window.location.reload();
    } catch (error) {
      console.error("上傳失敗：", error);
      alert("上傳失敗");
    } finally {
      setIsUploading(false); // 上傳結束，重置狀態
    }
  };

  return (
    <div>
      <p>Hello {user.userName}</p>
      <button onClick={goToAdminRegister}>新增管理員</button>
      <button onClick={handleLogout}>登出</button>
      <h1>上傳本地檔案</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>
        {isUploading ? "正在上傳..." : "上傳"}
      </button>
      {isUploading && <p>上傳進度：{uploadProgress}%</p>}
      <br/>
      <br/>
      <h1>顯示所有檔案</h1>
      <p>總共 {numberOfFiles} 個檔案</p>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <span>{file}</span>
            <button onClick={() => handleDeleteFile(file)}>
              刪除檔案
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewFiles;
