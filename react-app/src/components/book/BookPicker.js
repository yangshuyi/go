import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {Button, CheckList, Dialog, Input, Modal} from "antd-mobile";
import {XmsInput, XmsPicker} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";
import BookUtils from "./BookUtils";


function BookPicker(props) {

    useEffect(() => {
        init();
    }, []);

    const [bookOptions, setBookOptions] = useState([]);

    const init = async () => {
        setBookOptions(BookUtils.getBookOptions);
    }

    const itemRender = (item, props) => {
        return (
            <CheckList.Item key={item.bookName} value={item.bookName} description={item.problemCnt}>
                {item.bookName}
            </CheckList.Item>
        );
    }

    const addBookName = useRef();
    const addBook = async () => {
        await Dialog.confirm({
            title: '添加书籍',
            content: <div><XmsInput onChange={(bookName) => addBookName.current = bookName}/></div>,
        });

        if (addBookName.current) {
            await BookUtils.saveBook({
                bookName: addBookName.current
            });

            init();
        }
    }

    return (<XmsPicker
        mode={props.mode} value={props.value} showSearch={true} itemRender={itemRender} disabled={props.disable}
        headerRightBtn={<Button color="primary" fill="none" size="small" onClick={() => addBook([null])}>添加</Button>}
        options={bookOptions} optionFieldLabel="bookName" optionFieldValue="bookName" optionFieldKeyword="keyword"
        onChange={props.onChange}
    />)
}

export default BookPicker;



