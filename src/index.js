import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootswatch/dist/slate/bootstrap.min.css";
import reportWebVitals from './reportWebVitals';

import MasterPage from './pages/MasterPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MasterPage />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
