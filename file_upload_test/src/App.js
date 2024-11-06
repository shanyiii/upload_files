import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './FileUpload';
import ViewFiles from './ViewFiles';
import AdminRegister from './AdminRegister';
import AdminLogin from './AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/viewFiles" element={<ViewFiles />} />
        <Route path="/fileUpload" element={<FileUpload />} />
        <Route path="/adminRegister" element={<AdminRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
