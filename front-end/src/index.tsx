import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './app/App';
import AppStyles from './app/AppStyles';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AppStyles />
    <App />
  </React.StrictMode>
);
