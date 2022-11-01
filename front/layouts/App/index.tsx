import React from 'react';
import { Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const LogIn = loadable(() => import('@pages/Login'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/workspace/channel" element={<Channel />} />
    </Routes>
  );
};

export default Index;
