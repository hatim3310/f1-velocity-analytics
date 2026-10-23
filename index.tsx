import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/oxanium/latin-400.css';
import '@fontsource/oxanium/latin-700.css';
import '@fontsource/oxanium/latin-800.css';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
