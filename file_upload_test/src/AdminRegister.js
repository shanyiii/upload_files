import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function AdminRegister() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 跳轉到 /adminLogin 頁面
  const goToAdminLogin = () => {
    navigate('/');
  };

  // 表單提交處理函數
  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單默認提交行為（刷新頁面）

    try {
      const response = await axios.post('http://localhost:5000/admin/register', {
        account: account,
        password: password,
      });

      alert(response.data.message);
      goToAdminLogin();
    } catch (error) {
      console.error('提交表單出錯：', error);
      alert(error.response.data.error);
    }
  };

  return (
        <div>
          <h1>新增管理員</h1>
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
                <button type="submit">申請</button>
            </form>
        </div>
    );
}

export default AdminRegister;