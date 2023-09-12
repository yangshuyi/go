import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import _ from 'lodash';

import './ChessBoard.css';
import ChessUtils from "../../module/util/ChessUtils";
import Constants from "../../Constants";
import {DomUtils} from "sirius-common-utils";

const ChessBoard = (props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            init: init,
            drawChess: drawChess,
            clearChess: clearChess,
        }
    });

    const pageInitialized = useRef(false);
    const domChessBoardCanvasRef = useRef();

    const data = useRef({
        chessBoardSize: 11, //'路'
        showMark: true,
        canvas: {
            ctx: null,
            scale: 1,
            boardBorder: 0, //棋盘边长
            unitBorder: 0, //格子边长
            padding: 0, //棋盘边距
            domElemLeft: 0,
            domElemTop: 0,
        },
    });

    const [canvasWidth, setCanvasWidth] = useState(null);
    const [canvasHeight, setCanvasHeight] = useState(null);

    useEffect(() => {
        if (pageInitialized.current) {
            return;
        }
        if (!domChessBoardCanvasRef.current) {
            return;
        }

        let canvas = domChessBoardCanvasRef.current;
        data.current.canvas.ctx = canvas.getContext("2d");
        data.current.canvas.boardBorder = canvas.offsetWidth * data.current.canvas.scale;
        data.current.canvas.domElemLeft = canvas.getBoundingClientRect().left;
        data.current.canvas.domElemTop = canvas.getBoundingClientRect().top;

        setCanvasWidth(data.current.canvas.boardBorder);
        setCanvasHeight(data.current.canvas.boardBorder);

        setTimeout(() => {
            props.onBoardReady();
        }, 1000)
    }, [domChessBoardCanvasRef.current]);

    const init = async (chessBoardSize, showMark = false) => {
        data.current.chessBoardSize = chessBoardSize;
        data.current.showMark = showMark;

        let unit = Math.trunc(data.current.canvas.boardBorder / ((data.current.chessBoardSize + 1) * 2)); //padding为unitBorder的1/2
        console.log("unit:" + unit);
        // if (unit > 20) {
        //     unit = 20;
        // }
        data.current.canvas.unitBorder = unit * 2;
        data.current.canvas.padding = unit * 2;
        console.log("data.canvas.padding:" + data.current.canvas.padding);
        data.current.canvas.boardBorder = data.current.canvas.padding * 2 + data.current.canvas.unitBorder * (data.current.chessBoardSize - 1);

        drawCanvas();
    }

    function drawCanvas() {
        let ctx = data.current.canvas.ctx;
        // ctx.scale(data.current.canvas.scale, data.current.canvas.scale);
        drawPadding();
        drawLine(ctx);
    }

    function drawPadding() {
        let ctx = data.current.canvas.ctx;
        ctx.save();

        ctx.beginPath();
        ctx.clearRect(0, 0, data.current.canvas.boardBorder, data.current.canvas.boardBorder);
        ctx.restore();
    }

    function drawLine() {
        let ctx = data.current.canvas.ctx;
        ctx.save();

        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.font = 'normal bold 20px Arial'


        //竖线
        for (let colIdx = 0; colIdx < data.current.chessBoardSize; colIdx++) {
            let label = ChessUtils.getGeoLabelByIdx(data.current.chessBoardSize, 'column2', colIdx);
            ctx.fillText(label, data.current.canvas.padding + data.current.canvas.unitBorder * colIdx, data.current.canvas.padding / 4);
            ctx.fillText(label, data.current.canvas.padding + data.current.canvas.unitBorder * colIdx, data.current.canvas.boardBorder - data.current.canvas.padding / 4);

            ctx.moveTo(data.current.canvas.padding + data.current.canvas.unitBorder * colIdx, data.current.canvas.padding);
            ctx.lineTo(data.current.canvas.padding + data.current.canvas.unitBorder * colIdx, data.current.canvas.boardBorder - data.current.canvas.padding);
            ctx.stroke();

        }
        //横线
        for (let rowIdx = 0; rowIdx < data.current.chessBoardSize; rowIdx++) {
            let label = ChessUtils.getGeoLabelByIdx(data.current.chessBoardSize, 'row2', rowIdx);
            ctx.fillText(label, data.current.canvas.padding / 4, data.current.canvas.padding + data.current.canvas.unitBorder * rowIdx);
            ctx.fillText(label, data.current.canvas.boardBorder - data.current.canvas.padding / 4, data.current.canvas.padding + data.current.canvas.unitBorder * rowIdx);

            ctx.moveTo(data.current.canvas.padding, data.current.canvas.padding + data.current.canvas.unitBorder * rowIdx);
            ctx.lineTo(data.current.canvas.boardBorder - data.current.canvas.padding, data.current.canvas.padding + data.current.canvas.unitBorder * rowIdx);
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * chessObj:
     *  caption
     *  type: black,white
     *  marked: true,false,
     *  geo: '0419'
     */
    function drawChess(chessObj) {
        //console.log("drawChess:" + JSON.stringify(chessObj));
        if (!chessObj) {
            return;
        }

        let ctx = data.current.canvas.ctx;
        ctx.save();

        let posIdx = ChessUtils.getPosIdxFromGeo(data.current.chessBoardSize, chessObj.$geo);
        let x = posIdx.x * data.current.canvas.unitBorder + data.current.canvas.padding;
        let y = posIdx.y * data.current.canvas.unitBorder + data.current.canvas.padding;

        ctx.translate(x, y);

        let chessRadius = data.current.canvas.unitBorder * 4 / 9;

        ctx.fillStyle = Constants.CHESS_TYPE[chessObj.type].color;
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.arc(0, 0, chessRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();

        if (data.current.showMark && chessObj.marked) {
            let border = chessRadius * 2 / 3;

            ctx.fillStyle = Constants.CHESS_TYPE[chessObj.type].markedColor;
            ctx.strokeStyle = 'black';

            ctx.beginPath();
            ctx.moveTo(0, -1 * border);
            ctx.lineTo(border * Math.cos(Math.PI / 6), border * Math.sin(Math.PI / 6));
            ctx.lineTo(-1 * border * Math.cos(Math.PI / 6), border * Math.sin(Math.PI / 6));
            ctx.fill();
            ctx.closePath();
            ctx.stroke();
        }

        if (chessObj.$caption) {
            ctx.fillStyle = Constants.CHESS_TYPE[chessObj.type].markedColor;

            ctx.textAlign = 'center';
            ctx.textBaseline = "middle";
            ctx.font = 'normal bold 20px Arial'
            ctx.fillText(chessObj.$caption, 0, 0);
        }

        ctx.restore();
    }


    function clearChess(chessObj) {
        if (!chessObj) {
            return;
        }

        let ctx = data.current.canvas.ctx;
        ctx.save();

        let posIdx = ChessUtils.getPosIdxFromGeo(data.current.chessBoardSize, chessObj.$geo);
        let x = posIdx.x * data.current.canvas.unitBorder + data.current.canvas.padding;
        let y = posIdx.y * data.current.canvas.unitBorder + data.current.canvas.padding;
        ctx.translate(x, y);

        ctx.strokeStyle = "black";

        ctx.clearRect(-data.current.canvas.unitBorder / 2, -data.current.canvas.unitBorder / 2, data.current.canvas.unitBorder, data.current.canvas.unitBorder);

        ctx.beginPath();
        if (posIdx.x === 0) {
            ctx.moveTo(0, 0);
            ctx.lineTo(data.current.canvas.unitBorder / 2, 0);
        } else if (posIdx.x === (data.current.chessBoardSize - 1)) {
            ctx.moveTo(-data.current.canvas.unitBorder / 2, 0);
            ctx.lineTo(0, 0);
        } else {
            ctx.moveTo(-data.current.canvas.unitBorder / 2, 0);
            ctx.lineTo(data.current.canvas.unitBorder / 2, 0);
        }
        ctx.stroke();

        ctx.beginPath();
        if (posIdx.y === 0) {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, data.current.canvas.unitBorder / 2);
        } else if (posIdx.y === (data.current.chessBoardSize - 1)) {
            ctx.moveTo(0, -data.current.canvas.unitBorder / 2);
            ctx.lineTo(0, 0);
        } else {
            ctx.moveTo(0, -data.current.canvas.unitBorder / 2);
            ctx.lineTo(0, data.current.canvas.unitBorder / 2);
        }
        ctx.stroke();

        ctx.restore();
    }

    function onCanvasClick(event) {
        let offset = DomUtils.offset(domChessBoardCanvasRef.current);
        let posX = Math.round(((event.pageX - offset.left - data.current.canvas.padding)) / data.current.canvas.unitBorder);
        let posY = Math.round(((event.pageY - offset.top - data.current.canvas.padding)) / data.current.canvas.unitBorder);

        if (posX < 0 || posX >= data.current.chessBoardSize) {
            return;
        } else if (posY < 0 || posY >= data.current.chessBoardSize) {
            return;
        }

        let geo = ChessUtils.getGeoFromPosIdx(data.current.chessBoardSize, {x: posX, y: posY});

        if (props.onChessStep) {
            props.onChessStep({$geo: geo});
        }
    }


    return (
        <div className={props.showBoard === true ? "chess-board with-board" : "chess-board"}>
            <div className="wrap">
                <canvas ref={domChessBoardCanvasRef}
                        width={canvasWidth} height={canvasHeight}
                        onClick={onCanvasClick}/>
            </div>
        </div>
    )
}

const WrapChessBoard = forwardRef(ChessBoard);

export default WrapChessBoard;




