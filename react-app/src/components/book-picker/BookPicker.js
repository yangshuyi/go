import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList} from "antd-mobile";
import {XmsPicker} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";


function BookPicker(props) {

    useEffect(() => {
        init();
    }, []);

    const [bookOptions, setBookOptions] = useState([]);

    const init = async () => {
        setBookOptions(ProblemUtils.getBooks());
    }

    const itemRender = (item, props) => {
        return (
            <CheckList.Item key={item.bookName} value={item.bookName} description={item.problemCnt}>
                {item.bookName}
            </CheckList.Item>
        );
    }

    return (<XmsPicker
        mode={props.mode} value={props.value} showSearch={true} itemRender={itemRender} disabled={props.disable}
        options={bookOptions} optionFieldLabel="bookName" optionFieldValue="bookName" optionFieldKeyword="keyword"
        onChange={props.onChange}
    />)
}

export default BookPicker;



