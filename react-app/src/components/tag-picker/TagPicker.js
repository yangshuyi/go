import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList} from "antd-mobile";
import {XmsPicker} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";


function TagPicker(props) {

    useEffect(() => {
        init();
    }, []);

    const [tagOptions, setTagOptions] = useState([]);

    const init = async () => {
        setTagOptions(ProblemUtils.getTags());
    }

    const itemRender = (item, props) => {
        return (
            <CheckList.Item key={item.tagName} value={item.tagName} description={item.problemCnt}>
                {item.tagName}
            </CheckList.Item>
        );
    }

    return (<XmsPicker
        mode={props.mode} value={props.value} showSearch={true} itemRender={itemRender} disabled={props.disable}
        options={tagOptions} optionFieldLabel="tagName" optionFieldValue="tagName" optionFieldKeyword="keyword"
        onChange={props.onChange}
    />)
}

export default TagPicker;



