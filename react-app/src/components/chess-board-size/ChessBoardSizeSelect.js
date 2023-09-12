import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList} from "antd-mobile";
import {XmsPicker, XmsSelect} from "sirius-react-mobile";
import Constants from "../../Constants";


function ChessBoardSizeSelect(props) {

    useEffect(() => {
        init();
    }, []);

    const [chessBoardSizeOptions, setChessBoardSizeOptions] = useState(Constants.CHESS_BOARD_SIZE_OPTIONS);

    const init = async () => {
    }

    return (<XmsSelect
        mode={props.mode} value={props.value} disabled={props.disable}
        options={chessBoardSizeOptions} optionFieldLabel="text" optionFieldValue="value"
        onChange={props.onChange}
    />)
}

export default ChessBoardSizeSelect;



