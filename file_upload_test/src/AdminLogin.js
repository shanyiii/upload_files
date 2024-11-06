import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState('');

  const navigate = useNavigate();

  // 跳轉到 /viewfiles 頁面
  const goToViewFiles = () => {
    navigate('/viewFiles');
  };

  // 表單提交處理函數
  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單默認提交行為（刷新頁面）

    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        account: account,
        password: password,
      });

      // 設置回應訊息
      setResponseMessage(response.data.message);
      goToViewFiles();
    } catch (error) {
      console.error('提交表單出錯：', error);
      setResponseMessage('表單提交失敗');
    }
  };

  return (
        <div>
            <h1>管理員登入</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>帳號：</label>
                    <input 
                        type="text" 
                        value={account} 
                        onChange={(e) => setAccount(e.target.value)} 
                        required 
                    />
                </div>
                <br/>
                <div>
                    <label>密碼：</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <br/>
                <button type="submit">登入</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}

export default AdminLogin;