import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {Button, CheckList, Dialog} from "antd-mobile";
import {XmsInput, XmsPicker} from "sirius-react-mobile";
import TagUtils from "./TagUtils";


function TagPicker(props) {

    useEffect(() => {
        init();
    }, []);

    const [tagOptions, setTagOptions] = useState([]);

    const init = async () => {
        setTagOptions(TagUtils.getTagOptions());
    }

    const itemRender = (item, props) => {
        return (
            <CheckList.Item key={item.tagName} value={item.tagName} description={item.problemCnt}>
                {item.tagName}
            </CheckList.Item>
        );
    }

    const addTagName = useRef();
    const addTag = async () => {
        await Dialog.confirm({
            title: '添加标签',
            content: <div><XmsInput onChange={(tagName) => addTagName.current = tagName}/></div>,
        });

        if (addTagName.current) {
            await TagUtils.saveTag({
                tagName: addTagName.current
            });

            init();
        }
    }

    return (<XmsPicker
        mode={props.mode} value={props.value} showSearch={true} itemRender={itemRender} disabled={props.disable}
        headerRightBtn={<Button color="primary" fill="none" size="small" onClick={() => addTag([null])}>添加</Button>}
        options={tagOptions} optionFieldLabel="tagName" optionFieldValue="tagName" optionFieldKeyword="keyword"
        onChange={props.onChange}
    />)
}

export default TagPicker;



