import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList, List, Radio, Space, Switch} from "antd-mobile";
import {XmsPicker, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";
import ChessBoard from "./ChessBoard";
import {BackwardOutlined, CaretLeftOutlined, EyeFilled, HeartFilled} from "@ant-design/icons";
import Constants from "../../Constants";


function GameView(props) {
    const domChessBoardRef = useRef();

    const [game, setGame] = useState();
    const [showMark, setShowMark] = useState(false);
    const [showBoard, setShowBoard] = useState(true);
    const [currNextStep, setCurrNextStep] = useState(null);


    const init = async () => {
        setShowMark(false);

        reset();
    }

    const handleBoardReady = () => {
        init();
    }

    const reset = () => {
        let game = JSON.parse(JSON.stringify(props.game));
        game.$stepList = []; //每一手
        game.$currChessBoard = {}; //当前棋盘上的棋子信息
        game.$currChessBoard = game.chessBoard;
        setGame(game);
        setCurrNextStep(game.nextChessType); //下一手

        domChessBoardRef.current.init(game.chessBoardSize, showMark, showBoard);
        _.each(game.$currChessBoard, (chess) => {
            domChessBoardRef.current.drawChess(chess);
        });
    }

    function stepForward(action, chess) {
        if (action === 'add') {
            game.$currChessBoard[chess.$geo] = chess;
            domChessBoardRef.current.drawChess(chess);
        } else if (action === 'remove') {
            delete game.$currChessBoard[chess.$geo];
            domChessBoardRef.current.clearChess(chess);
        }

        game.$stepList.push({
            action: action,
            chess: chess
        });
    }

    const stepBackward = () => {
        let lastStep = game.$stepList.pop();
        if (!lastStep) {
            return;
        }

        if (lastStep.action === 'add') {
            delete game.$currChessBoard[lastStep.chess.$geo];
            domChessBoardRef.current?.clearChess(lastStep.chess);
        } else if (lastStep.action === 'remove') {
            game.$currChessBoard[lastStep.chess.$geo] = lastStep.chess;
            domChessBoardRef.current?.drawChess(lastStep.chess);
        }
    }

    const handleChessStep = ($chess) => {
        let geo = $chess.$geo;
        let chess = game.$currChessBoard[geo];

        if (currNextStep === Constants.CHESS_TYPE.C.value) {
            //删除棋子
            if (chess) {
                //棋盘上有棋子
                stepForward('remove', chess);
            } else {
                //棋盘上没有棋子
            }
        } else {
            if (chess) {
                //棋盘上有棋子
            } else {
                //棋盘上没有棋子

                //创建棋子
                let caption = (_.max(_.map(game.$currChessBoard, '$caption')) || 0) + 1;

                let chessType = Constants.CHESS_TYPE[currNextStep];
                let newChess = {
                    type: chessType.value,
                    $caption: caption,
                    marked: false,
                    $geo: geo
                };
                stepForward('add', newChess);

                //调整下一步
                setCurrNextStep(chessType.nextStep);
            }
        }
    }

    const handleFieldChanged = (field, value) => {
        setGame((oldObj) => {
            let newObj = {...oldObj};
            newObj[field] = value;
            return newObj;
        })
    }


    return <div className="game-view">
        <List>
            <List.Item extra={
                <Radio.Group value={currNextStep} onChange={setCurrNextStep}>
                    <Space direction='horizontal'>
                        <Radio value='B'>黑棋</Radio>
                        <Radio value='W'>白棋</Radio>
                        <Radio value='C'>清除</Radio>
                    </Space>
                </Radio.Group>
            }>
                当前手
            </List.Item>

            <List.Item extra={<Switch value={showMark} onChange={setShowMark}/>}>
                展示标记
            </List.Item>
            <List.Item extra={<Switch value={showBoard} onChange={setShowBoard}/>}>
                展示棋盘
            </List.Item>
        </List>

        <ChessBoard ref={domChessBoardRef} onBoardReady={handleBoardReady} onChessStep={handleChessStep}/>

        {/*<div className="game-view-action-bar">*/}
        {/*    <div className={showMark ? "action-bar-item selected" : "action-bar-item unselected"}*/}
        {/*         onClick={() => setShowMark(!showMark)}*/}
        {/*    >*/}
        {/*        <div className="icon"><BackwardOutlined style={{fontSize: '22px'}}/></div>*/}
        {/*        <div className="text">标记</div>*/}
        {/*    </div>*/}
        {/*    <div className={showBoard ? "action-bar-item selected" : "action-bar-item unselected"}*/}
        {/*         onClick={() => setShowBoard(!showBoard)}*/}
        {/*    >*/}
        {/*        <div className="icon"><BackwardOutlined style={{fontSize: '22px'}}/></div>*/}
        {/*        <div className="text">棋盘</div>*/}
        {/*    </div>*/}
        {/*    <div className={game.$stepList.length === 0 ? "action-bar-item selected" : "action-bar-item unselected"}*/}
        {/*         onClick={() => reset()}*/}
        {/*    >*/}
        {/*        <div className="icon"><BackwardOutlined style={{fontSize: '22px'}}/></div>*/}
        {/*        <div className="text">还原</div>*/}
        {/*    </div>*/}
        {/*    <div className={game.$stepList.length === 0 ? "action-bar-item selected" : "action-bar-item unselected"}*/}
        {/*         onClick={() => stepBackward()}*/}
        {/*    >*/}
        {/*        <div className="icon"><CaretLeftOutlined style={{fontSize: '22px'}}/></div>*/}
        {/*        <div className="text">上一步</div>*/}
        {/*    </div>*/}
        {/*</div>*/}
    </div>

}

export default GameView;



