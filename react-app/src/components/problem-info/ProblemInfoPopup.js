import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemInfoView.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, Collapse, FloatingPanel, Form, List, NavBar, Popup, PullToRefresh, Selector, Space, Switch, TabBar, Tabs} from "antd-mobile";
import {ExclamationCircleFill, RedoOutline, StarFill, StarOutline} from "antd-mobile-icons";
import {useLocation} from "react-router";
import {DownOutlined, EditFilled, HeartFilled, UpOutlined} from "@ant-design/icons";
import {NavigateUtils, XmsInput, XmsPicker, XmsTextArea} from "sirius-react-mobile";
import TagPicker from "../tag/TagPicker";
import LevelPicker from "../level/LevelPicker";
import Constants from "../../Constants";
import BookPicker from "../book/BookPicker";
import ProblemInfoView from "./ProblemInfoView";
import ProblemUtils from "../../module/util/ProblemUtils";


function ProblemInfoPopup(props) {
    useEffect(() => {
        if (props.problem) {
            init();
        }
    }, [props.problem]);


    const init = async () => {
    }

    const modifiedObj = useRef(null);
    const handleProblemChange = async (problem) => {
        modifiedObj.current = problem;
    }

    const handleBtnClick = async () => {
        if (modifiedObj.current) {
            if (props.onChange) {
                props.onChange(modifiedObj);
            }
            if (props.onClose) {
                props.onClose();
            }
        }
    }

    const handleCancel = () => {
        modifiedObj.current = null;
        if (props.onClose) {
            props.onClose();
        }
    }

    return (
        <Popup visible={true}
               position='left' mask={false} destroyOnClose={true}
               className="problem-info-popup"
               onClose={props.onClose}
        >
            <ProblemInfoView problem={props.problem} onChange={handleProblemChange}></ProblemInfoView>
            <Space className="margin-top-base" align="center" justify="around">
                <Button color='primary' fill='solid' onClick={handleBtnClick}>保存</Button>
                <Button color='primary' fill='outline' onClick={handleCancel}>取消</Button>
            </Space>
        </Popup>
    )
}

export default ProblemInfoPopup;



