import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import AppStyles from './Components/AppStyles';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <AppStyles />
    <App />
  </React.StrictMode>
);
