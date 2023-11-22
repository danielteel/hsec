import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ConfigProvider } from 'antd';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerHeight: 48
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
