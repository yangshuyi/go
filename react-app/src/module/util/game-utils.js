import _ from 'lodash';
import dayjs from "dayjs";

let GAME_MAP = {}; //key: Id, value Game
let GAME_LIST = []; //key: Id, value Game
let gameTmpl = null;

async function loadGameData() {
    // let dataList = await IndexAxiosUtils.loadGameData();
    // if (!dataList) {
    //     return dataList;
    // }
    //
    // init(dataList);
    //
    // return dataList;
}

async function downloadGameData() {
    // let dataList = await IndexAxiosUtils.downloadGameData();
    // if (!dataList) {
    //     return dataList;
    // }
    //
    // init(dataList);
    //
    // return dataList;
}

function init(gameList) {
    // if (gameList == null) {
    //     CccisDialogUtils.alert("加载围棋题目资源文件失败");
    //     return;
    // }
    // _.each(gameList, (game, idx) => {
    //     GAME_MAP[game.id] = game;
    //     buildGame(game);
    // });
    //
    // GAME_LIST = _.orderBy(gameList, ['modifyDateText'], ['desc']);
}

function buildGame(game) {
    // game.chessBoardSizeText = game.chessBoardSize + "路";
    //
    // if (!_.isEmpty(game.tags) && game.tags[0] != '') {
    //     game.tagsText = _.join(game.tags, ",");
    // } else {
    //     game.tagsText = '';
    //     game.tags = [];
    // }
    //
    // game.level = (game.level || '0') + "";
    // let gameLevel = Constants.LEVEL_OPTIONS[game.level];
    // game.levelText = gameLevel.text;
    // game.levelIcon = gameLevel.icon;
    // game.levelIconColor = gameLevel.iconColor;
    //
    // if (game.hardFlag == null) {
    //     game.hardFlag = false;
    // }
    //
    // game.modifyDateText = dayjs(game.modifyDate).format('YYYY-MM-DD');
    // game.introValue = "《" + game.book + "》" + game.title;
    // game.introLabel = game.modifyDateText + "　　" + game.chessBoardSizeText + "　　" + game.tagsText;
    //
    // if (game.nextChessType == 'BLACK') {
    //     game.nextChessType = 'B';
    // } else if (game.nextChessType == 'WHITE') {
    //     game.nextChessType = 'W';
    // }
    //
    // if (!game.chessBoard && _.isArray(game.chessList)) {
    //     let chessBoard = {};
    //     _.each(game.chessList, (chess) => {
    //         let key = ChessUtils.getGeoFromPosIdx(game.chessBoardSize, chess.pos);
    //         chess.geo = key;
    //
    //         chessBoard[key] = chess;
    //         delete chess.pos;
    //     });
    //
    //     delete game.chessList;
    //     game.chessBoard = chessBoard;
    // }
    //
    // _.each(game.chessBoard, (chess, geo) => {
    //     game.caption = game.caption || '';
    //     chess.geo = geo;
    //
    //
    //     if (chess.color) {
    //         chess.type = _.find(Constants.CHESS_TYPE, {color: chess.color}).value;
    //         delete chess.color;
    //         delete chess.markedColor;
    //     }
    //
    //     delete chess.fixed;
    // });
    //
    //
    // delete game.stepList;
    // delete game.currNextStep;
}

async function uploadGameData() {
    // if (_.isEmpty(GAME_LIST)) {
    //     CccisLoggerUtils.warn("GAME_LIST is empty");
    //     return;
    // }
    //
    // let dataList = [];
    // _.each(GAME_LIST, (game) => {
    //     let data = JSON.parse(JSON.stringify(game));
    //     delete data.currChessList;
    //
    //     delete data.chessBoardSizeText;
    //
    //     delete data.levelText;
    //     delete data.levelIcon;
    //     delete data.levelIconColor;
    //
    //     delete data.modifyDateText;
    //     delete data.introValue;
    //     delete data.introLabel;
    //
    //     delete data.$stepList;
    //     delete data.$currChessBoard;
    //     delete data.$currNextStep;
    //
    //     TagUtils.formatGameTagsBeforeUpload(data);
    //
    //     _.each(data.chessBoard, (chess, geo) => {
    //         if (chess.caption == '') {
    //             delete chess.caption;
    //         }
    //
    //         delete chess.geo;
    //     });
    //
    //     dataList.push(data);
    // });
    //
    // await IndexAxiosUtils.uploadGameData(dataList);
}


function fetchAllGames(filterParams) {
    // let gameList = [];
    // if (filterParams) {
    //     _.each(GAME_LIST, (game) => {
    //         if (filterParams.onlyHardFlag == true) {
    //             if (game.hardFlag != true) {
    //                 return;
    //             }
    //         }
    //
    //         if (filterParams.ignoreNewFlag == true) {
    //             if (game.level == Constants.LEVEL_OPTIONS[3].value) {
    //                 return;
    //             }
    //         }
    //
    //         if (!_.isEmpty(filterParams.books)) {
    //             if (!_.includes(filterParams.books, game.book)) {
    //                 return;
    //             }
    //         }
    //
    //         if (!_.isEmpty(filterParams.tags)) {
    //             if (_.isEmpty(_.intersection(game.tags, filterParams.tags))) {
    //                 return;
    //             }
    //         }
    //         gameList.push(game);
    //     })
    // } else {
    //     gameList = GAME_LIST;
    // }
    // return gameList;
}

function fetchNextGame(currGameId) {
    // let currIdx = _.findIndex(GAME_LIST, {id: currGameId});
    // if (currIdx >= 0 && currIdx < (GAME_LIST.length - 1)) {
    //     return GAME_LIST[currIdx + 1];
    // } else {
    //     return null;
    // }
}

function getGameById(gameId) {
    // let game = GAME_MAP[gameId];
    // return game;
}

function addGame(game) {
    // if (GAME_MAP[game.id] != null) {
    //     return false;
    // }
    // GAME_MAP[game.id] = game;
    // GAME_LIST.push(game);
    // GAME_LIST = _.orderBy(GAME_LIST, ['modifyDateText'], ['desc']);
    // return true;
}

function generateNewGameTitle(oldTitle) {
    // let array = _.split(oldTitle, '-');
    // let lastTitleSegment = array[array.length - 1];
    //
    // let number = _.toNumber(lastTitleSegment);
    // if (!Number.isNaN(number)) {
    //     array[array.length - 1] = number + 1;
    // }
    // return _.join(array, '-');
}

function getGameTemplate() {
    // return gameTmpl;
}


function saveGameTemplate(game) {
    // gameTmpl = {
    //     book: game.book,
    //     title: game.title,
    //     chessBoardSize: game.chessBoardSize,
    //     desc: game.desc,
    //     tagsText: game.tagsText,
    //     level: game.level,
    //     nextChessType: game.nextChessType,
    //
    // }
}

function custom(){
    // TagUtils.custom(GAME_LIST);
}

export default {

    uploadGameData: uploadGameData,
    loadGameData: loadGameData,

    downloadGameData: downloadGameData,

    fetchAllGames: fetchAllGames,
    fetchNextGame: fetchNextGame,
    getGameById: getGameById,
    addGame: addGame,
    buildGame: buildGame,

    generateNewGameTitle: generateNewGameTitle,
    getGameTemplate: getGameTemplate,
    saveGameTemplate: saveGameTemplate,

    custom: custom,
};
