import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  // 跳轉到 /viewfiles 頁面
  const goToViewFiles = () => {
    navigate('/viewfiles');
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
      <h2>上傳本地檔案</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>上傳</button>
      <br/>
      <br/>
      <button onClick={goToViewFiles}>前往檔案瀏覽</button>
    </div>
  );
}

export default FileUpload;
