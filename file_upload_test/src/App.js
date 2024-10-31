import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FileUpload from './FileUpload';
import ViewFiles from './ViewFiles';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/viewfiles" element={<ViewFiles />} />
      </Routes>
    </Router>
  );
}

export default App;
