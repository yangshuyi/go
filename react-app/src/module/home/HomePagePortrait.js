import React, {useEffect, useRef, useState} from 'react';

import './HomePage.css';

import {Button, NavBar, Space} from "antd-mobile";

function HomePagePortrait(props) {
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

    return (
        <div className="xms-page-content with-padding-top padding">
            <Space direction='vertical' block={true}>
                {props.menuArray.map((menu) => (
                    <Button key={menu.text} color="primary" block onClick={() => navToPage(menu)}>{menu.text}</Button>
                ))}
            </Space>
        </div>
    )
}

export default HomePagePortrait;



