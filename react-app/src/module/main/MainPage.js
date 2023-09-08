import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './MainPage.css';

import {HashRouter, Route, useNavigate, Outlet} from "react-router-dom";
import {XmsSpinView} from "sirius-react-mobile";
import BookUtils from "../../components/book/BookUtils";
import TagUtils from "../../components/tag/TagUtils";

function MainPage(props) {
    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;

        if(!dataInitialized) {
            init();
        }
    }, []);

    const init = async () => {
        Promise.all([
            BookUtils.init(),
            TagUtils.init(),
        ]).then(() => {
            setDataInitialized(true);
        });
    }

    return <>{dataInitialized ? <Outlet/> : <XmsSpinView/>}</>;
}

export default MainPage;



