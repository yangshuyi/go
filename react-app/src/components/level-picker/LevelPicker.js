import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList} from "antd-mobile";
import {XmsPicker} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";
import Constants from "../../Constants";


function LevelPicker(props) {

    useEffect(() => {
        init();
    }, []);

    const [levelOptions, setLevelOptions] = useState([]);

    const init = async () => {
        setLevelOptions(_.values(Constants.LEVEL_OPTIONS));
    }

    const itemRender = (item, props) => {
        return (
            <CheckList.Item key={item.value} value={item.value} prefix={item.icon}>
                {item.text}
            </CheckList.Item>
        );
    }

    return (<XmsPicker
        mode={props.mode} value={props.value} showSearch={false} itemRender={itemRender} disabled={props.disable}
        options={levelOptions} optionFieldLabel="text" optionFieldValue="value"
        onChange={props.onChange}
    />)
}

export default LevelPicker;



