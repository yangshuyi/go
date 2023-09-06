import React from 'react';
import ReactDOM from 'react-dom/client';

import './css/variable.css';
import '../node_modules/sirius-react-mobile/dist/style.css';

import {ConfigProvider, SafeArea} from "antd-mobile";
import enUS from 'antd-mobile/es/locales/en-US';
import Entrance from "./Entrance";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={enUS} themeVars={{}}>
        <div>
            <SafeArea position='top'/>
            <Entrance/>
            <SafeArea position='bottom'/>
        </div>
    </ConfigProvider>
);
