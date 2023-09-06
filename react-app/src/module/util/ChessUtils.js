import _ from 'lodash';
import Constants from "../../Constants";

/**
 * 根据1912获取 {x：12, y:19}
 * 0-19：行从下往上
 * 0-19: 列从左往右
 */
function getPosIdxFromGeo(chessBoardSize, chessGeo) {
    let y = parseInt(chessGeo.substr(0, 2)) - 1;
    let x = parseInt(chessGeo.substr(2, 2)) - 1;

    if (chessBoardSize === 9) {
        return {x: x, y: 9 - y};
    } else if (chessBoardSize == 11) {
        return {x: x, y: 11 - y};

    } else if (chessBoardSize === 13) {
        return {x: x, y: 13 - y};

    } else if (chessBoardSize === 17) {
        return {x: x, y: 17 - y};

    } else if (chessBoardSize === 19) {
        return {x: x, y: 19 - y};

    } else {
        throw '错误'
    }
}

function getGeoFromPosIdx(chessBoardSize, chessPosIdx) {
    let chessPosIdxY = 0;
    if (chessBoardSize === 9) {
        chessPosIdxY = 9 - chessPosIdx.y;
    } else if (chessBoardSize === 11) {
        chessPosIdxY = 11 - chessPosIdx.y;
    } else if (chessBoardSize === 13) {
        chessPosIdxY = 13 - chessPosIdx.y;
    } else if (chessBoardSize === 17) {
        chessPosIdxY = 17 - chessPosIdx.y;
    } else if (chessBoardSize === 19) {
        chessPosIdxY = 19 - chessPosIdx.y;
    } else {
        throw '错误'
    }

    let x = _.padStart(chessPosIdx.x + 1, 2, '0');
    let y = _.padStart(chessPosIdxY + 1, 2, '0');


    return y + x;
}

/**
 * 根据棋盘大小及行列值，获取棋盘的行列标签文字
 */
function getGeoLabelByIdx(chessBoardSize, rowOrCol, idx) {
    if (rowOrCol === 'column1' || rowOrCol === 'column2') {
        let x = _.padStart(idx + 1, 2, '0');
        return _.get(Constants.CHESS_BOARD_LABEL[x], rowOrCol);
    } else if (rowOrCol === 'row1' || rowOrCol === 'row2') {
        let y = _.padStart(chessBoardSize - idx, 2, '0');
        return _.get(Constants.CHESS_BOARD_LABEL[y], rowOrCol);
    } else {
        throw '无法识别rowOrCol：' + rowOrCol;
    }
}

export default {
    getPosIdxFromGeo: getPosIdxFromGeo,
    getGeoFromPosIdx: getGeoFromPosIdx,
    getGeoLabelByIdx: getGeoLabelByIdx,
};
