import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ViewFiles.module.css';
import { UserContext } from '../context/UserContext';
import { InfoModal } from './InfoModal';
import information from '../information.png';

function ViewFiles() {
  const [files, setFiles] = useState([]);
  const [numberOfFiles, setNumberOfFiles] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sizeOfFiles, setSizeOfFiles] = useState(0.0);
  const { user, setUser } = useContext(UserContext);

  const [isUploading, setIsUploading] = useState(false); // 上傳狀態
  const [uploadProgress, setUploadProgress] = useState(0); // 上傳進度
  const [infoShow, setInfoShow] = useState(false); // 資訊欄

  const navigate = useNavigate();

  const handleOpenInfo = () => setInfoShow(true);
  const handleCloseInfo = () => setInfoShow(false);

  // 跳轉到登入頁面
  const goToAdminRegister = () => {
    navigate('/adminRegister');
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/files')
      .then(response => {
        console.log(response.data);
        setFiles(response.data.files);
        setNumberOfFiles(response.data.numberOfFiles);
        setSizeOfFiles(response.data.size);
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
      <div className={styles.topBar}>
        <p>Hello {user.userName}</p>
        <div>
          <button className={styles.registerButton} onClick={goToAdminRegister}>新增管理員</button>
          <button className={styles.logoutButton} onClick={handleLogout}>登出</button>          
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.uploadContainer}>
          <h1>上傳本地檔案</h1>
          <label htmlFor="fileInput" className={styles.customFileButton}>
            選擇檔案
          </label>
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            className={styles.hiddenFileInput}
          />
          <p>{selectedFile ? selectedFile.name : "尚未選擇檔案"}</p>
          <button onClick={handleUpload} className={styles.uploadButton}>
            {isUploading ? "正在上傳..." : "上傳"}
          </button>
          {isUploading && <p className={styles.uploadProgress}>上傳進度：{uploadProgress}%</p>}          
        </div>
        <br/>
        <br/>
        <img src={information} width='20px' alt='information' onClick={handleOpenInfo}></img>
        <InfoModal
          show={infoShow}
          onClose={handleCloseInfo}
        />
        <p>檔案數量：{numberOfFiles}/10000 個</p>
        <p>檔案總大小：{sizeOfFiles} MB</p>
        <div className={styles.tableContainer}>
          <table className={styles.fileTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>檔案名稱</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td id={styles.number}>{index + 1}</td>
                  <td>{file}</td>
                  <td>
                    <button onClick={() => handleDeleteFile(file)}>刪除檔案</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>           
        </div>
       
      </div>

    </div>
  );
}

export default ViewFiles;
