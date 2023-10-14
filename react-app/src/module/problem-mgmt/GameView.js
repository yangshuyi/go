import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import * as PropTypes from "prop-types";

import {Button, CheckList, List, Radio, Space, Switch} from "antd-mobile";
import Constants from "../../Constants";
import ChessBoard from "../../components/game/ChessBoard";

function GameView(props) {
    const domChessBoardRef = useRef();
    const chessBoardReadyFlag = useRef(false);

    const [markChessFlag, setMarkChessFlag] = useState();
    const [chessType, setChessType] = useState(null);
    const chessBoard = useRef({});

    useEffect(() => {
        if (props.chessBoardSize) {
            init();
        }
    }, [props.value, props.chessBoardSize]);


    const init = async () => {
        chessBoard.current = props.value || {};
        setChessType(Constants.CHESS_TYPE.B.value);
        setMarkChessFlag(false);
        reset();
    }

    const handleBoardReady = () => {
        chessBoardReadyFlag.current = true;
        reset();
    }

    const reset = () => {
        if (chessBoardReadyFlag.current === true && props.chessBoardSize) {
            domChessBoardRef.current.init(props.chessBoardSize, true);
            _.each(chessBoard.current, (chess) => {
                domChessBoardRef.current.drawChess(chess);
            });
        }
    }

    const handleChessStep = ($chess) => {
        let geo = $chess.$geo;
        let chess = chessBoard.current[geo];

        if (chessType === Constants.CHESS_TYPE.C.value) {
            //删除棋子
            if (chess) {
                //棋盘上有棋子
                delete chessBoard.current[chess.$geo];
                domChessBoardRef.current.clearChess(chess);

                handleChanged();
            } else {
                //棋盘上没有棋子
            }
        } else {
            if (chess) {
                //棋盘上有棋子, 更新标记
                chess.type = chessType;
                chess.marked = markChessFlag;
                domChessBoardRef.current.drawChess(chess);
            } else {
                //棋盘上没有棋子, 创建棋子
                let newChess = {
                    type: chessType,
                    marked: markChessFlag,
                    $geo: geo
                };

                chessBoard.current[newChess.$geo] = newChess;
                domChessBoardRef.current.drawChess(newChess);
            }

            handleChanged();
        }
    }

    const handleChanged = () => {
        if (props.onChange) {
            props.onChange(chessBoard.current);
        }
    }


    return <div className="game-view">
        <List>
            <List.Item extra={
                <Radio.Group value={chessType} onChange={setChessType}>
                    <Space direction='horizontal'>
                        <Radio value='B'>黑棋</Radio>
                        <Radio value='W'>白棋</Radio>
                        <Radio value='C'>清除</Radio>
                    </Space>
                </Radio.Group>
            }>
                当前手
            </List.Item>

            <List.Item extra={<Switch checked={markChessFlag} onChange={setMarkChessFlag}/>}>
                标记棋子
            </List.Item>
        </List>

        <ChessBoard ref={domChessBoardRef} showBoard={false}
                    onBoardReady={handleBoardReady} onChessStep={handleChessStep}/>
    </div>

}


GameView.propTypes = {
    chessBoardSize: PropTypes.number,

}


export default GameView;



