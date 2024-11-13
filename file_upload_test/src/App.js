import React, { createContext, useState } from 'react';
import Views from './router/Views';
import { UserProvider } from './context/UserContext';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <RouterProvider router={Views} />
    </UserProvider>
  )
}

export default App;
