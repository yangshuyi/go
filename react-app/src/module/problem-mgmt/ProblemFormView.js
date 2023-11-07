import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import _ from 'lodash';


import {Button, Collapse, FloatingPanel, Form, List, NavBar, PullToRefresh, Selector, Switch, TabBar, Tabs} from "antd-mobile";

import {XmsInput, XmsPicker, XmsTextArea} from "sirius-react-mobile";
import ChessBoardSizeSelect from "../../components/chess-board-size/ChessBoardSizeSelect";
import ChessTypeSelect from "../../components/chess-type-size/ChessTypeSelect";
import TagPicker from "../../components/tag/TagPicker";
import BookPicker from "../../components/book/BookPicker";
import LevelPicker from "../../components/level/LevelPicker";
import GameView from "./GameView";
import ProblemUtils from "../util/ProblemUtils";
import {FormUtils} from "sirius-common-utils";


const ProblemFormView = (props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            getFormData: getFormData
        }
    });

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

    const chessBoardSize = Form.useWatch('chessBoardSize', form);

    const getFormData = async () => {
        try {
            await form.validateFields();

            let formData = form.getFieldsValue();
            formData.id = props.problem.id;

            return formData;
        } catch (e) {
            FormUtils.scrollToFirstError(e);
        }
    }

    return (formData == null ? null :
            <>
                <Form form={form} layout="horizontal" initialValues={formData}>
                    <Form.Header>基本信息</Form.Header>
                    <Form.Item label="书籍" name="book" rules={[{required: true}]}>
                        <BookPicker/>
                    </Form.Item>
                    <Form.Item label="标题" name="title"  rules={[{required: true}]}>
                        <XmsInput/>
                    </Form.Item>
                    <Form.Item label="描述" name="desc" >
                        <XmsTextArea/>
                    </Form.Item>
                    <Form.Item label="标签" name="tags">
                        <TagPicker mode="multiple"/>
                    </Form.Item>
                    <Form.Item label="棋盘大小" name="chessBoardSize" rules={[{required: true}]}>
                        <ChessBoardSizeSelect/>
                    </Form.Item>
                    <Form.Item label="级别" name="level" rules={[{required: true}]}>
                        <LevelPicker/>
                    </Form.Item>
                    <Form.Item label="难题" name="hardFlag" childElementPosition='right'>
                        <Switch/>
                    </Form.Item>
                    <Form.Item label="下一手" name="nextChessType" childElementPosition='right' rules={[{required: true}]}>
                        <ChessTypeSelect />
                    </Form.Item>
                    <Form.Header>棋盘</Form.Header>
                    <Form.Item name="chessBoard" layout="vertical" rules={[{required: true}]}>
                        <GameView chessBoardSize={chessBoardSize} singleRow={true}/>
                    </Form.Item>
                </Form>
            </>
    )
}

const WrapProblemFormView = forwardRef(ProblemFormView);

export default WrapProblemFormView;



