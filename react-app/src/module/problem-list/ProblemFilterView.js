import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './ProblemListPage.css';

import {Button, Collapse, Form, Space, Switch} from "antd-mobile";
import {DownOutlined, UpOutlined} from "@ant-design/icons";
import BookPicker from "../../components/book/BookPicker";
import TagPicker from "../../components/tag/TagPicker";


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

    const handleFilterChange = () => {
        if (props.onChange) {
            props.onChange(form.getFieldsValue());
        }

        setCollapsed(true);
    }

    return (formData == null ? null :
            <div className="problem-filter-view">
                <div className="problem-filter-view-header" onClick={() => setCollapsed(!collapsed)}>
                    <div className="flex-1">列表过滤面板</div>
                    {collapsed ? <UpOutlined/> : <DownOutlined/>}
                </div>
                <div className={collapsed ? 'problem-filter-view-body display-none' : 'problem-filter-view-body'}>
                    <Form form={form} layout='horizontal' initialValues={formData}>
                        <Form.Item label="书籍" name="books">
                            <BookPicker mode="multiple"/>
                        </Form.Item>
                        <Form.Item label="标签" name="tags">
                            <TagPicker mode="multiple"/>
                        </Form.Item>
                        <Form.Item label="仅展示难题" name="onlyHardFlag" childElementPosition='right'>
                            <Switch/>
                        </Form.Item>
                        <Form.Item label="排除新题" name="ignoreNewFlag" childElementPosition='right'>
                            <Switch/>
                        </Form.Item>
                    </Form>

                    <div className="button-bar">
                        <Button color="primary" block onClick={() => handleFilterChange()}>应用</Button>
                    </div>

                </div>
            </div>
    )
}

export default ProblemFilterView;



