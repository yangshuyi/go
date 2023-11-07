import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import './GameView.css'

import {Button, CheckList, List, Radio, Space, Switch} from "antd-mobile";
import ChessBoard from "./ChessBoard";
import Constants from "../../Constants";
import ConfigUtils from "../config/ConfigUtils";
import ChessUtils from "../../module/util/ChessUtils";

import StepBeep from "../../assets/step.mp3"
import {SpinUtils} from "sirius-react-mobile";


function GameView(props) {
    const domAudioRef = useRef();
    const domChessBoardRef = useRef();

    const [game, setGame] = useState();
    const [showMark, setShowMark] = useState(false);
    const [showBoard, setShowBoard] = useState(false);
    const [currNextStep, setCurrNextStep] = useState(null);
    const stepList = useRef([]); //每一手


    const init = async () => {
        setShowMark(false);

        let showBoard = await ConfigUtils.getShowBoardFlag();
        setShowBoard(showBoard);

        reset(showMark);
    }

    const handleBoardReady = () => {
        init();
    }

    const handleShowMarkChange = () => {
        let newShowMark = !showMark;
        setShowMark(newShowMark);
        reset(newShowMark);
    }


    const reset = (showMark) => {
        console.log("GameView: reset")
        let game = JSON.parse(JSON.stringify(props.game));
        game.$currChessBoard = {}; //当前棋盘上的棋子信息
        game.$currChessBoard = game.chessBoard;
        setGame(game);
        setCurrNextStep(game.nextChessType); //下一手

        stepList.current = [];

        domChessBoardRef.current.init(game.chessBoardSize, showMark);
        _.each(game.$currChessBoard, (chess) => {
            domChessBoardRef.current.drawChess(chess);
        });
    }

    function stepForward(action, chess) {
        let tiziList = null;
        if (action === 'add') {
            domAudioRef.current.currentTime = 0;
            domAudioRef.current.play();

            game.$currChessBoard[chess.$geo] = chess;
            domChessBoardRef.current.drawChess(chess);

            tiziList = ChessUtils.checkTizi(game.chessBoardSize, chess, game.$currChessBoard);
            _.each(tiziList, (oppositeChess) => {
                delete game.$currChessBoard[oppositeChess.$geo];
                domChessBoardRef.current.clearChess(oppositeChess);
            });
        } else if (action === 'remove') {
            delete game.$currChessBoard[chess.$geo];
            domChessBoardRef.current.clearChess(chess);
        }

        stepList.current.push({
            action: action,
            chess: chess,
            tiziList: tiziList,
        });
    }

    const stepBackward = () => {
        let lastStep = stepList.current.pop();
        if (!lastStep) {
            return;
        }

        if (lastStep.action === 'add') {
            delete game.$currChessBoard[lastStep.chess.$geo];
            domChessBoardRef.current?.clearChess(lastStep.chess);

            _.each(lastStep.tiziList, (oppositeChess) => {
                game.$currChessBoard[oppositeChess.$geo] = oppositeChess;
                domChessBoardRef.current?.drawChess(oppositeChess);
            });
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

    console.log("GameView render");

    return <div className="game-view">
        {props.singleRow === true ?
            <div className="single-row">
                <div className="flex-row">
                    <label>当前手</label>
                    <div>
                        <Radio.Group value={currNextStep} onChange={setCurrNextStep}>
                            <Space direction='horizontal'>
                                <Radio value='B'>黑棋</Radio>
                                <Radio value='W'>白棋</Radio>
                                <Radio value='C'>清除</Radio>
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                <div className="flex-row">
                    <label>展示标记</label>
                    <div>
                        <Switch checked={showMark} onChange={handleShowMarkChange}/>
                    </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex-row">
                    <label>操作</label>
                    <div>
                        <Space>
                            <Button size='mini' color='primary' fill='outline' loading='auto' disabled={stepList.current.length === 0} onClick={() => reset(showMark)}>还原</Button>
                            <Button size='mini' color='primary' fill='outline' loading='auto' disabled={stepList.current.length === 0} onClick={stepBackward}>上一步</Button>
                        </Space>
                    </div>
                </div>
            </div>
            :
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

                <List.Item extra={<Switch checked={showMark} onChange={handleShowMarkChange}/>}>
                    展示标记
                </List.Item>
                <List.Item extra={
                    <Space>
                        <Button size='mini' color='primary' fill='outline' loading='auto' disabled={stepList.current.length === 0} onClick={() => reset(showMark)}>还原</Button>
                        <Button size='mini' color='primary' fill='outline' loading='auto' disabled={stepList.current.length === 0} onClick={stepBackward}>上一步</Button>
                    </Space>
                }>
                    操作
                </List.Item>
            </List>
        }

        <audio ref={domAudioRef} src={StepBeep} style={{display: 'none'}}/>

        <ChessBoard ref={domChessBoardRef}
                    showBoard={showBoard}
                    onBoardReady={handleBoardReady} onChessStep={handleChessStep}/>



    </div>

}

export default GameView;



