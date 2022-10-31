import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@layouts/app';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
