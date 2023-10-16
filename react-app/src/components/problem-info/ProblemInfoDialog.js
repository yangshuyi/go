import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemInfoView.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, Collapse, FloatingPanel, Form, List, NavBar, PullToRefresh, Selector, Switch, TabBar, Tabs} from "antd-mobile";
import {ExclamationCircleFill, RedoOutline, StarFill, StarOutline} from "antd-mobile-icons";
import {useLocation} from "react-router";
import {DownOutlined, EditFilled, HeartFilled, UpOutlined} from "@ant-design/icons";
import {NavigateUtils, XmsInput, XmsPicker, XmsTextArea} from "sirius-react-mobile";
import TagPicker from "../tag/TagPicker";
import LevelPicker from "../level/LevelPicker";
import Constants from "../../Constants";
import BookPicker from "../book/BookPicker";


function ProblemInfoViewDialog(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currPageKey] = useState(() => NavigateUtils.buildPageKey(location));

    useEffect(() => {
        if (props.problem) {
            init();
        }
    }, [props.problem]);


    const init = async () => {
        let formData = props.problem;
        setFormData(formData);
    }

    const floatPanelHeightMin = 100;
    const floatPanelHeightMax = 500;
    const [currFloatPanelHeight, setCurrFloatingPanelHeight] = useState();
    const [currFloatPanelMinState, setCurrFloatPanelMinState] = useState(true);

    const handleFloatingPanelHeightChange = function (height, animating) {
        setCurrFloatingPanelHeight(height);
    }

    useEffect(() => {
        if (currFloatPanelHeight === floatPanelHeightMin) {
            setCurrFloatPanelMinState(true);
        } else if (currFloatPanelHeight === floatPanelHeightMax) {
            setCurrFloatPanelMinState(false);
        }
    }, [currFloatPanelHeight]);


    const [form] = Form.useForm();
    const [formData, setFormData] = useState();
    const [levelOptions, setLevelOptions] = useState(_.values(Constants.LEVEL_OPTIONS));

    const handleFormValueChange = (changedValues, allValues) => {
        setFormData((oldData) => {
            let newData = {...oldData, ...allValues};

            if (props.onChange) {
                props.onChange(newData);
            }
            return newData;
        });

        if (props.onChange) {
            props.onChange(allValues);
        }
    }

    const handleFieldChange = (field, value) => {
        setFormData((oldData) => {
            let newData = {...oldData};
            newData[field] = value;

            if (props.onChange) {
                props.onChange(newData);
            }
            return newData;
        });
    }

    const navToProblemMgmtPage = ()=>{
        NavigateUtils.navigateTo(navigate, Constants.ROUTER.PROBLEM_MGMT.path, {
            state: {
                key: currPageKey,
                problemId: props.problem.id,
            },
        });
    }

    return (formData == null ? null :
            <>
            <FloatingPanel className="problem-info-view" style={{ '--header-height': '40px'}}
                           anchors={[floatPanelHeightMin, floatPanelHeightMax]}
                           onHeightChange={handleFloatingPanelHeightChange}
            >
                    <Form form={form} layout='horizontal' initialValues={formData}
                          onValuesChange={handleFormValueChange}
                    >
                        <Form.Item label="书籍" name="book">
                            <BookPicker/>
                        </Form.Item>
                        <Form.Item label="标题" name="title">
                            <XmsInput/>
                        </Form.Item>
                        <Form.Item label="描述" name="desc">
                            <XmsTextArea/>
                        </Form.Item>
                        <Form.Item label="标签" name="tags">
                            <TagPicker mode="multiple"/>
                        </Form.Item>
                    </Form>
            </FloatingPanel>

                <div className="problem-info-view-action-bar">
                    {levelOptions.map((levelOption) => (
                        <div key={levelOption.value} className={levelOption.value === formData.level ? "action-bar-item selected" : "action-bar-item unselected"}
                             onClick={() => handleFieldChange("level", levelOption.value)}>
                            <div className="icon">{levelOption.icon}</div>
                            <div className="text">{levelOption.text}</div>
                        </div>
                    ))}

                    <div className={formData.hardFlag ? "action-bar-item selected" : "action-bar-item unselected"}
                         onClick={() => handleFieldChange("hardFlag", !formData.hardFlag)}>
                        <div className="icon"><HeartFilled style={{fontSize: '22px', color: 'red'}}/></div>
                        <div className="text">难题</div>
                    </div>

                    <div className="action-bar-item unselected"
                         onClick={navToProblemMgmtPage}>
                        <div className="icon"><EditFilled style={{fontSize: '22px', color: 'var(--adm-color-primary)'}}/></div>
                        <div className="text">管理</div>
                    </div>
                </div>
            </>
    )
}

export default ProblemInfoView;



