import ViewFiles from '../page/ViewFiles';
import AdminRegister from '../page/AdminRegister';
import AdminLogin from '../page/AdminLogin';
import ProtectedRoutes from './ProtectedRoutes';
import { Navigate, createBrowserRouter, createRoutesFromElements, BrowserRouter as Routes, Route } from 'react-router-dom';


// const Views = () => {
//     return (
//         <Routes>
//           <Route path="/" element={<AdminLogin />} />
//           <Route element={<ProtectedRoutes />}>
//             <Route path="/viewFiles" element={<ViewFiles />} />
//             <Route path="/adminRegister" element={<AdminRegister />} />
//             <Route path='*' element={<Navigate to='/' replace />} />
//           </Route>
//         </Routes>
//     );
// }

const Views = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AdminLogin />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/viewFiles" element={<ViewFiles />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </>
  )
)

export default Views;