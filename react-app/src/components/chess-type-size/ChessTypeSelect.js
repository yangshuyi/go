import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList} from "antd-mobile";
import {XmsPicker} from "sirius-react-mobile";
import Constants from "../../Constants";
import XmsSelect from "../chess-board-size/XmsSelect";


function ChessTypeSelect(props) {

    useEffect(() => {
        init();
    }, []);

    const [chessTypeOptions, setChessTypeOptions] = useState([Constants.CHESS_TYPE.B, Constants.CHESS_TYPE.W]);

    const init = async () => {
    }

    return (<XmsSelect
        mode={props.mode} value={props.value} disabled={props.disable} columns={chessTypeOptions.length}
        options={chessTypeOptions} optionFieldLabel="text" optionFieldValue="value"
        onChange={props.onChange}
    />)
}

export default ChessTypeSelect;



