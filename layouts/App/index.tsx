import React from 'react';
import { Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('../Workspace'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/workspace/:workspace/*" element={<Workspace />} />
    </Routes>
  );
};

export default App;
