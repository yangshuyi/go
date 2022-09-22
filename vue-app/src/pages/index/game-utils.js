import _ from 'lodash';
import dayjs from "dayjs";
import {CccisDialogUtils} from "@cccis/vue3-common";
import Constants from "@/components/constants.js";

let GAME_MAP = {}; //key: Id, value Game
let GAME_LIST = []; //key: Id, value Game

function init(gameList) {
    if (gameList == null) {
        CccisDialogUtils.alert("加载围棋题目资源文件失败");
        return;
    }
    _.each(gameList, (game, idx) => {
        GAME_MAP[game.id] = game;
        buildGame(game);
    });

    GAME_LIST = _.orderBy(gameList, ['modifyDateText'], ['desc']);
}

function buildGame(game) {
    game.chessBoardSizeText = game.chessBoardSize + "路";
    game.tagsText = _.join(game.tags, ",");
    game.level = (game.level || '0') + "";
    let gameLevel = Constants.LEVEL_OPTIONS[game.level];
    game.levelText = gameLevel.text;
    game.levelIcon = gameLevel.icon;
    game.levelIconColor = gameLevel.iconColor;

    game.modifyDateText = dayjs(game.modifyDate).format('YYYY-MM-DD');
    game.introValue = "《" + game.book + "》" + game.title;
    game.introLabel = game.modifyDateText + "　　" + game.chessBoardSizeText + "　　" + game.tagsText;
}

function fetchAllGames() {
    return GAME_LIST;
}

function fetchNextGame(currGameId) {
    let currIdx = _.findIndex(GAME_LIST, {id: currGameId});
    if (currIdx >= 0 && currIdx < (GAME_LIST.length - 1)) {
        return GAME_LIST[currIdx + 1];
    } else {
        return null;
    }
}

function getGameById(gameId) {
    let game = GAME_MAP[gameId];
    return game;
}

function addGame(game) {
    if (GAME_MAP[game.id] != null) {
        return false;
    }
    GAME_MAP[game.id] = game;
    return true;
}

export default {
    init: init,
    fetchAllGames: fetchAllGames,
    fetchNextGame: fetchNextGame,
    getGameById: getGameById,
    addGame: addGame,
    buildGame: buildGame
};
