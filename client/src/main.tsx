import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppRoute from './routes/AppRoute'
import {CssBaseline} from "@mui/material";
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById("root");
const root= createRoot(rootElement!);
root.render(

    <BrowserRouter>
        <CssBaseline/>
        <AppRoute />
    </BrowserRouter>

)




/* ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <CssBaseline/>
        <AppRoute />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
); */
