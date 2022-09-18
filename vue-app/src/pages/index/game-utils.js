import _ from 'lodash';
import dayjs from "dayjs";
import {CccisAxiosUtils, CccisDialogUtils} from "@cccis/vue3-common";
import IndexAxiosUtils from "@/pages/index/index-axios-utils";
import Constants from "@/components/Constants";

let GAME_MAP = {}; //key: Id, value Game


async function init() {
    let gameList = await IndexAxiosUtils.loadGameData();
    if(gameList == null){
        CccisDialogUtils.alert("加载围棋题目资源文件失败");
    }else{
        _.each(gameList, (game) => {
            GAME_MAP[game.id] = game;
        });
    }
}

function fetchAllGames() {
    return _.values(GAME_MAP);
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
    getGameById: getGameById,
    addGame: addGame,
};
