import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListPage.css';

import {useNavigate} from "react-router-dom";
import {useActivate, useAliveController} from "react-activation";
import {Button, Collapse, Form, List, NavBar, PullToRefresh, Selector, Switch, Tabs} from "antd-mobile";
import {ExclamationCircleFill, RedoOutline, StarFill, StarOutline} from "antd-mobile-icons";
import {useLocation} from "react-router";
import {DownOutlined, UpOutlined} from "@ant-design/icons";


function ProblemFilterView(props) {

    useEffect(() => {
        init();
    }, []);


    const init = async () => {
        let formData = {};
        setFormData(formData);
    }

    const [form] = Form.useForm();
    const [formData, setFormData] = useState();
    const [collapsed, setCollapsed] = useState(true);
    const [bookOptions, setBookOptions] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    return (formData == null ? null :
            <div className="problem-filter-view">
                <div className="problem-filter-view-header" onClick={() => setCollapsed(!collapsed)}>
                    <div className="flex-1">列表过滤面板</div>
                    {collapsed ? <UpOutlined/> : <DownOutlined/>}
                </div>
                <div className={collapsed ? 'problem-filter-view-body invisible' : 'problem-filter-view-body'}>
                    <Form form={form} layout='horizontal' initialValues={formData}>
                        <Form.Item label="书籍" name="books">
                            <Selector options={bookOptions}/>
                        </Form.Item>
                        <Form.Item label="标签" name="tags">
                            <Selector options={tagOptions}/>
                        </Form.Item>
                        <Form.Item label="仅展示难题" name="onlyHardFlag" childElementPosition='right'>
                            <Switch/>
                        </Form.Item>
                        <Form.Item label="排除新题" name="ignoreNewFlag" childElementPosition='right'>
                            <Switch/>
                        </Form.Item>
                    </Form>
                </div>
            </div>
    )
}

export default ProblemFilterView;



