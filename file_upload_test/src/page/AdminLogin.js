import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './AdminLogin.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function AdminLogin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  // 表單提交處理函數
  const handleSubmit = async (event) => {
    event.preventDefault(); // 防止表單默認提交行為（刷新頁面）

    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        account: account,
        password: password,
      });

      setUser({userName: account, isLogin: true});

      alert(response.data.message);
    } catch (error) {
      console.error('提交表單出錯：', error);
      alert(error.response.data.error);
    }
  };

  // 當 user.isLogin 設置為 true 時，跳轉到 /viewFiles 頁面
  useEffect(() => {
    if (user.isLogin) {
      console.log("登入使用者：", user.userName);
      navigate('/viewFiles');
    }
  }, [user.isLogin, navigate]); // 當 user.isLogin 或 navigate 改變時觸發

  return (
        <div className={styles.container}>
            <form className={styles.login} onSubmit={handleSubmit}>
              <h2>管理員登入</h2>
              <div className={styles.formGroup}>
                <label>帳號</label>
                <input 
                    type="text" 
                    value={account} 
                    onChange={(e) => setAccount(e.target.value)} 
                    required 
                />
              </div>
              <br/>
              <div className={styles.formGroup}>
                <label>密碼</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
              </div>
              <br/>
              <button className={styles.btn} type="submit">登入</button>
            </form>
        </div>
    );
}

export default AdminLogin;