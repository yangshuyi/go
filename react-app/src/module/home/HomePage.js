import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './HomePage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar, Space} from "antd-mobile";
import {useLocation} from "react-router";
import Constants from "../../Constants";
import {NavigateUtils, XmsSpinView} from "sirius-react-mobile";
import ConfigUtils from "../../components/config/ConfigUtils";
import HomePageLandscape from "./HomePageLandscape";
import HomePagePortrait from "./HomePagePortrait";

function HomePage(props) {
    const pageInitialized = useRef(false);
    const [dataInitialized, setDataInitialized] = useState(false);

    const [screenOrientationLandscape, setScreenOrientationLandscape] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        pageInitialized.current = true;

        if (!dataInitialized) {
            init();
        }
    }, []);

    let init = async () => {
        let screenOrientationLandscape = await ConfigUtils.getScreenOrientationLandscape()
        setScreenOrientationLandscape(screenOrientationLandscape)

        setDataInitialized(true);
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

    return (dataInitialized !== true ? <XmsSpinView/> :
        <div className="home-page">
            <NavBar backArrow={false}
                    right={<Button color="primary" fill="solid" size="small" onClick={() => exit()}>退出</Button>}
            >
                GO
            </NavBar>
            {screenOrientationLandscape ?
            <HomePageLandscape menuArray={menuArray}
                               onNavToPage={navToPage}
                               onExit={exit}/>
            :
            <HomePagePortrait menuArray={menuArray}
                              onNavToPage={navToPage}
                              onExit={exit}/>
            }
        </div>
    )
}

export default HomePage;



