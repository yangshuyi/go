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

function checkJingRuDian(chessBoardSize, currChessObj, chessBoard) {
    //step1: get around chess with self
    let globalHasQi = false;

    let allMyChessMap = getAllOppositeChessList(chessBoardSize, currChessObj, {}, chessBoard);

    _.each(allMyChessMap, (myChessObj) => {
        let hasQi = isChessHasQi(chessBoardSize, myChessObj, chessBoard);
        if (hasQi) {
            globalHasQi = true;
            return false;
        }
    });

    return !globalHasQi;
}


function checkTizi(chessBoardSize, currChessObj, chessBoard) {
    let chessType = currChessObj.type;
    let oppositeChessType = Constants.CHESS_TYPE[chessType].nextStep;

    let oppositeChessList = getAroundChess(chessBoardSize, currChessObj, oppositeChessType, chessBoard);
    let tiziList = [];
    _.each(oppositeChessList, (oppositeChess) => {
        let allOppositeChessMap = getAllOppositeChessList(chessBoardSize, oppositeChess, {}, chessBoard);
        let checkTizi = true;
        _.each(allOppositeChessMap, (oppositeChessObj) => {
            let hasQi = isChessHasQi(chessBoardSize, oppositeChessObj, chessBoard);
            if (hasQi) {
                checkTizi = false;
                return false;
            }
        });

        if (checkTizi) {
            tiziList = _.union(tiziList, _.values(allOppositeChessMap));
        }
    });

    if (_.isEmpty(tiziList)) {
        return null;
    } else {
        console.log("checkTizi: " + tiziList);
        return tiziList;
    }
}

function getAroundChess(chessBoardSize, currChessObj, currChessType, chessBoard) {
  if(currChessObj==null) {
      debugger;
  }
    let chessPos = getPosIdxFromGeo(chessBoardSize, currChessObj.$geo);
    if (!chessPos) {
        return;
    }

    let array = [];
    let geo = null;
    if (chessPos.x > 0) {
        //check left
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x - 1, y: chessPos.y});
        if (chessBoard[geo]?.type === currChessType) {
            array.push(chessBoard[geo]);
        }
    }
    if (chessPos.x < (chessBoardSize - 1)) {
        //check right
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x + 1, y: chessPos.y});
        if (chessBoard[geo]?.type === currChessType) {
            array.push(chessBoard[geo]);
        }
    }
    if (chessPos.y > 0) {
        //check bottom
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x, y: chessPos.y - 1});
        if (chessBoard[geo]?.type === currChessType) {
            array.push(chessBoard[geo]);
        }
    }
    if (chessPos.y < (chessBoardSize - 1)) {
        //check top
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x, y: chessPos.y + 1});
        if (chessBoard[geo]?.type === currChessType) {
            array.push(chessBoard[geo]);
        }
    }

    return array;
}


function isChessHasQi(chessBoardSize, currChessObj, chessBoard) {
    if(currChessObj==null) {
        debugger;
    }
    let chessPos = getPosIdxFromGeo(chessBoardSize, currChessObj.$geo);
    if (chessPos.x > 0) {
        //check left
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x - 1, y: chessPos.y});
        if (chessBoard[geo] == null) {
            return true;
        }
    }
    if (chessPos.x < (chessBoardSize - 1)) {
        //check right
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x + 1, y: chessPos.y});
        if (chessBoard[geo] == null) {
            return true;
        }
    }
    if (chessPos.y > 0) {
        //check bottom
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x, y: chessPos.y - 1});
        if (chessBoard[geo] == null) {
            return true;
        }
    }
    if (chessPos.y < (chessBoardSize - 1)) {
        //check top
        let geo = getGeoFromPosIdx(chessBoardSize, {x: chessPos.x, y: chessPos.y + 1});
        if (chessBoard[geo] == null) {
            return true;
        }
    }
    return false;
}


function getAllOppositeChessList(chessBoardSize, currChessObj, existedChessMap, chessBoard) {
    if(currChessObj==null) {
        debugger;
    }

    if (existedChessMap[currChessObj.$geo] != null) {
        //already checked.
        return;
    }

    existedChessMap[currChessObj.$geo] = currChessObj;

    let _aroundChessList = getAroundChess(chessBoardSize, currChessObj, currChessObj.type, chessBoard);
    _.each(_aroundChessList, function (_aroundChessObj) {
        getAllOppositeChessList(chessBoardSize, _aroundChessObj, existedChessMap, chessBoard);
    });

    return existedChessMap;
}

export default {
    getPosIdxFromGeo: getPosIdxFromGeo,
    getGeoFromPosIdx: getGeoFromPosIdx,
    getGeoLabelByIdx: getGeoLabelByIdx,

    checkTizi: checkTizi,
    checkJingRuDian: checkJingRuDian,
};
