import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './HomePage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar, Space} from "antd-mobile";
import {useLocation} from "react-router";
import Constants from "../../Constants";
import {NavigateUtils} from "sirius-react-mobile";

function HomePage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    const pageInitialized = useRef(false);

    const [menuArray, setMenuArray] = useState([
        {
            text: '死活题', path: Constants.ROUTER.PROBLEM_LIST.path,
        },
        {
            text: '数据维护', path: Constants.ROUTER.DATA_MAINTENANCE.path,
        },
    ])

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        init();
    }, []);

    const init = async () => {

    }

    const navToPage = async (menu) => {
        NavigateUtils.navigateTo(navigate, menu.path, {
            state: {
                key: currPageKey,
            },
        });
    }

    function exit(e) {
        if (navigator.app) {
            navigator.app.exitApp();
        }
    }

    return (
        <div className="home-page">
            <NavBar backArrow={false}
                    right={<Button color="primary" fill="solid" size="small" onClick={() => exit()}>退出</Button>}
            >
                GO
            </NavBar>

            <div className="xms-page-content with-padding-top padding">
                <Space direction='vertical' block={true}>
                    {menuArray.map((menu) => (
                        <Button key={menu.text} color="primary" block onClick={() => navToPage(menu)}>{menu.text}</Button>
                    ))}
                </Space>
            </div>
        </div>
    )
}

export default HomePage;



