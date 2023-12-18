import React from 'react';
import ReactDOM from 'react-dom/client';


import Main from './Main';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <CssBaseline />
        <Main/>
    </React.StrictMode>
);
