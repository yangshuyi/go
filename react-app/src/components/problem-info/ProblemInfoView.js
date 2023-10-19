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


function ProblemInfoView(props) {
    useEffect(() => {
        if (props.problem) {
            init();
        }
    }, [props.problem]);


    const init = async () => {
        let formData = props.problem;
        setFormData(formData);
    }

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

    return (formData == null ? null :
            <>
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
            </>
    )
}

export default ProblemInfoView;



