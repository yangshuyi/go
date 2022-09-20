import _ from 'lodash';
import dayjs from "dayjs";
import {CccisAxiosUtils, CccisDialogUtils} from "@cccis/vue3-common";
import IndexAxiosUtils from "@/pages/index/index-axios-utils";
import Constants from "@/components/Constants";

let GAME_MAP = {}; //key: Id, value Game
let GAME_LIST = []; //key: Id, value Game


async function init() {
    let gameList = await IndexAxiosUtils.loadGameData();
    if(gameList == null){
        CccisDialogUtils.alert("加载围棋题目资源文件失败");
    }else{
        _.each(gameList, (game, idx) => {
            GAME_MAP[game.id] = game;

            game.chessBoardSizeText = game.chessBoardSize+"路";
            game.tagsText = _.join(game.tags, ",");
            game.levelText = game.level;
            game.modifyDateText = dayjs(game.modifyDate).format('YYYY-MM-DD');
            game.introValue = game.chessBoardSizeText+"-"+game.book+"-"+game.title;
            game.introLabel = game.modifyDateText+"   "+game.tagsText;
        });

        GAME_LIST = _.orderBy(gameList, ['modifyDateText'], ['desc']);
    }
}

function fetchAllGames() {
    return GAME_LIST;
}

function fetchNextGame(currGameId){
    let currIdx = _.findIndex(GAME_LIST, {id:currGameId});
    if(currIdx>=0 && currIdx<(GAME_LIST.length-1)){
        return GAME_LIST[currIdx+1];
    }else{
        return null;
    }

}

function getGameById(gameId) {
    return GAME_MAP[gameId];
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
};
