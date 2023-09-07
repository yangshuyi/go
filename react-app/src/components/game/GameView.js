import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

import {CheckList, List, Radio, Space, Switch} from "antd-mobile";
import {XmsPicker, XmsSpinView} from "sirius-react-mobile";
import ProblemUtils from "../../module/util/ProblemUtils";
import ChessBoard from "./ChessBoard";
import {BackwardOutlined, CaretLeftOutlined, EyeFilled, HeartFilled} from "@ant-design/icons";
import Constants from "../../Constants";


function GameView(props) {

    useEffect(() => {
        if (props.game) {
            init();
        }
    }, [props.game]);

    const [game, setGame] = useState();
    const [showMark, setShowMark] = useState(false);
    const [showBoard, setShowBoard] = useState(true);

    const domChessBoardRef = useRef();

    const init = async () => {
        setShowMark(false);

        setTimeout(() => {
            reset();
        });
    }

    const reset = () => {
        let game = JSON.parse(JSON.stringify(props.game));
        game.$stepList = []; //每一手
        game.$currChessBoard = {}; //当前棋盘上的棋子信息
        game.$currNextStep = game.nextChessType; //下一手
        game.$currChessBoard = game.chessBoard;

        domChessBoardRef.value?.init(game.chessBoardSize, showMark, showBoard);
        _.each(game.$currChessBoard, (chess) => {
            domChessBoardRef.current?.drawChess(chess);
        });

        setGame(game);
    }

    function stepForward(action, chess) {
        if (action === 'add') {
            game.$currChessBoard[chess.geo] = chess;
            domChessBoardRef.current?.drawChess(chess);
        } else if (action === 'remove') {
            delete game.$currChessBoard[chess.geo];
            domChessBoardRef.current?.clearChess(chess);
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
            delete game.$currChessBoard[lastStep.chess.geo];
            domChessBoardRef.current?.clearChess(lastStep.chess);
        } else if (lastStep.action === 'remove') {
            game.$currChessBoard[lastStep.chess.geo] = lastStep.chess;
            domChessBoardRef.current?.drawChess(lastStep.chess);
        }
    }

    const handleChessStep = ($chess) => {
        let geo = $chess.geo;
        let chess = game.$currChessBoard[geo];

        if (game.$currNextStep === Constants.CHESS_TYPE.C.value) {
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

                let chessType = Constants.CHESS_TYPE[game.$currNextStep];
                let newChess = {
                    type: chessType.value,
                    $caption: caption,
                    marked: false,
                    geo: geo
                };
                stepForward('add', newChess);

                //调整下一步
                game.$currNextStep = chessType.nextStep;
            }
        }
    }

    const handleFieldChanged = (field, value) => {
        setGame((oldObj) => {
            let newObj = [...oldObj];
            newObj[field] = value;
            return newObj;
        })
    }


    return (game == null ? <XmsSpinView/> :
            <div className="game-view">
                <List>
                    <List.Item extra={
                        <Radio.Group value={game.$currNextStep} onChange={(value) => handleFieldChanged('$currNextStep', value)}>
                            <Space direction='horizontal'>
                                <Radio value='B'>黑棋</Radio>
                                <Radio value='W'>白棋</Radio>
                                <Radio value='C'>清除</Radio>
                            </Space>
                        </Radio.Group>
                    }>
                        当前手
                    </List.Item>
                </List>

                <ChessBoard ref={domChessBoardRef} chessBoardSize={game.chessBoardSize} showMark={showMark} showBoard={showBoard} onChessStep={handleChessStep}/>

                <div className="game-view-action-bar">
                    <div className={showMark ? "action-bar-item selected" : "action-bar-item unselected"}
                         onClick={() => setShowMark(!showMark)}
                    >
                        <div className="icon"><BackwardOutlined style={{fontSize: '22px'}}/></div>
                        <div className="text">标记</div>
                    </div>
                    <div className={showBoard ? "action-bar-item selected" : "action-bar-item unselected"}
                         onClick={() => setShowBoard(!showBoard)}
                    >
                        <div className="icon"><BackwardOutlined style={{fontSize: '22px'}}/></div>
                        <div className="text">棋盘</div>
                    </div>
                    <div className={game.$stepList.length === 0 ? "action-bar-item selected" : "action-bar-item unselected"}
                         onClick={() => reset()}
                    >
                        <div className="icon"><BackwardOutlined style={{fontSize: '22px'}}/></div>
                        <div className="text">还原</div>
                    </div>
                    <div className={game.$stepList.length === 0 ? "action-bar-item selected" : "action-bar-item unselected"}
                         onClick={() => stepBackward()}
                    >
                        <div className="icon"><CaretLeftOutlined style={{fontSize: '22px'}}/></div>
                        <div className="text">上一步</div>
                    </div>
                </div>
            </div>
    )
}

export default GameView;



