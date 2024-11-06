import React, { useState } from 'react';
import axios from "axios";

function AdminRegister() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState('');

  // 表單提交處理函數
  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單默認提交行為（刷新頁面）

    try {
      const response = await axios.post('http://localhost:5000/admin/register', {
        account: account,
        password: password,
      });

      // 設置回應訊息
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error('提交表單出錯：', error);
      setResponseMessage('表單提交失敗');
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
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
}

export default AdminRegister;