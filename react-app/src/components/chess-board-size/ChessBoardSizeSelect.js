import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList} from "antd-mobile";
import {XmsPicker, XmsSelect} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";
import BookUtils from "./BookUtils";
import Constants from "../../Constants";


function ChessBoardSizeSelect(props) {

    useEffect(() => {
        init();
    }, []);

    const [chessBoardSizeOptions, setChessBoardSizeOptions] = useState(Constants.CHESS_BOARD_SIZE_OPTIONS);

    const init = async () => {
    }

    return (<XmsSelect
        mode={props.mode} value={props.value} showSearch={true} itemRender={itemRender} disabled={props.disable}
        options={chessBoardSizeOptions} optionFieldLabel="bookName" optionFieldValue="bookName" optionFieldKeyword="keyword"
        onChange={props.onChange}
    />)
}

export default ChessBoardSizeSelect;



