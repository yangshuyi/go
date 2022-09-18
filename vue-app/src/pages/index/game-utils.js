import _ from 'lodash';
import dayjs from "dayjs";
import {CccisAxiosUtils} from "@cccis/vue3-common";
import Constants from "@/components/Constants";

let GAME_MAP = {}; //key: Id, value Game


async function init() {
    let gamesList = await CccisAxiosUtils.getData("games.json");
    _.each(gamesList, (game) => {
        GAME_MAP[game.id] = game;
    });
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
