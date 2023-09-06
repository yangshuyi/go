import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './HomePage.css';

import {useNavigate} from "react-router-dom";
import {Button, NavBar} from "antd-mobile";
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

    return (
        <div className="home-page">
            <NavBar backArrow={false}>
                GO
            </NavBar>

            <div className="xms-page-content">
                {menuArray.map((menu) => {
                    return (
                        <Button key={menu.text} color="primary" block onClick={() => navToPage(menu)}>{menu.text}</Button>
                    )
                })}
            </div>
        </div>
    )
}

export default HomePage;



