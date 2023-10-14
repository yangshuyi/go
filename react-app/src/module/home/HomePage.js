import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './HomePage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar, Space} from "antd-mobile";
import {useLocation} from "react-router";
import Constants from "../../Constants";
import {NavigateUtils} from "sirius-react-mobile";
import ConfigUtils from "../../components/config/ConfigUtils";
import HomePageLandscape from "./HomePageLandscape";
import HomePagePortrait from "./HomePagePortrait";

function HomePage(props) {
    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState(() => ConfigUtils.getScreenOrientationLandscape());

    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    const pageInitialized = useRef(false);
    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        init();
    }, []);

    const init = async () => {

    }

    const [menuArray, setMenuArray] = useState([
        {
            text: '死活题', path: Constants.ROUTER.PROBLEM_LIST.path,
        },
        {
            text: '数据维护', path: Constants.ROUTER.DATA_MAINTENANCE.path,
        },
    ])

    const navToPage = async (menu) => {
        NavigateUtils.navigateTo(navigate, menu.path, {
            state: {
                key: currPageKey,
            },
        });
    }

    function exit() {
        if (navigator.app) {
            navigator.app.exitApp();
        }
    }

    return (screenOrientationLandscape ?
            <HomePageLandscape menuArray={menuArray}
                               onNavToPage={navToPage}
                               onExit={exit}/>
            :
            <HomePagePortrait menuArray={menuArray}
                              onNavToPage={navToPage}
                              onExit={exit}/>
    )
}

export default HomePage;



