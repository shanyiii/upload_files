import { useContext } from "react"
import { UserContext } from '../context/UserContext';
import { Outlet, useLocation, Navigate } from "react-router-dom";


const useAuth = () => {
    const { user } = useContext(UserContext);
    return user.isLogin;
}

const ProtectedRoutes = () => {
    const location = useLocation();
    const isAuth = useAuth();

    console.log("登入狀態：", isAuth);

    // 只允許已授權(已登入)的使用者訪問 ProtectedRoutes 包含的子路由
    return isAuth ? (
        <Outlet />
    ) : (
        <>
            <Navigate to='/' replace state={{ from: location }} />
        </>
    )
}

export default ProtectedRoutes;