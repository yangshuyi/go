import React, {useEffect, useRef, useState} from 'react';

import './HomePage.css';

import {Button, NavBar, Space} from "antd-mobile";

function HomePageLandscape(props) {
    const pageInitialized = useRef(false);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        init();
    }, []);

    const init = async () => {

    }

    const navToPage = async (menu) => {
        if (props.onNavToPage) {
            props.onNavToPage(menu)
        }
    }

    function exit() {
        if (props.onExit) {
            props.onExit()
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
                    {props.menuArray.map((menu) => (
                        <Button key={menu.text} color="primary" block onClick={() => navToPage(menu)}>{menu.text}</Button>
                    ))}
                </Space>
            </div>
        </div>
    )
}

export default HomePageLandscape;



