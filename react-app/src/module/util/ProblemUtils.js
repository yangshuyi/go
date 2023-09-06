import _ from 'lodash';

import {Octokit} from "octokit";
import {AxiosUtils, DateUtils, StringUtils} from "sirius-common-utils";
import Constants from "../../Constants";
import ChessUtils from "./ChessUtils";

let problemList = [];
let bookList = [];
let tagList = [];
let filteredProblemList = [];

function init(assetList) {
    problemList = assetList;
    let bookMap = _.groupBy(assetList, 'book');
    bookList = [];
    _.each(bookMap, (items, bookName) => {
        bookList.push({
            bookName: bookName,
            problemCnt: items.length,
            keyword: StringUtils.buildKeyword(bookName),
        })
    });
    bookList = _.orderBy(bookList, ['problemCnt'], ['desc']);

    let tagMap = {};
    _.each(assetList, (problem) => {
        buildGame(problem);

        _.each(problem.tags, (tag) => {
            if (!tag) {
                return;
            }
            let tagObj = tagMap[tag];
            if (!tagObj) {
                tagObj = {tagName: tag, problemCnt: 0, keyword: StringUtils.buildKeyword(tag)};
                tagMap[tag] = tagObj;
            }
            tagObj.problemCnt++;
        });
    });
    tagList = _.map(tagMap);
    tagList = _.orderBy(tagList, ['problemCnt'], ['desc']);
}


function getBooks() {
    return bookList;
}

function getTags() {
    return tagList;
}

async function filterProblemList(filterParam) {
    if (filterParam) {
        filteredProblemList = _.filter(problemList, (problem) => {
            if (filterParam.books && !_.isEmpty(filterParam.books)) {
                if (!_.includes(filterParam.books, problem.book)) {
                    return false;
                }
            }

            if (filterParam.tags && !_.isEmpty(filterParam.tags)) {
                if (!_.intersection(filterParam.tags, problem.tags)) {
                    return false;
                }
            }

            if (filterParam.onlyHardFlag === true) {
                if (problem.hardFlag !== true) {
                    return false;
                }
            }

            if (filterParam.ignoreNewFlag === true) {
                if (problem.level === Constants.LEVEL_OPTIONS[3].value) {
                    return false;
                }
            }

            return true;
        });
    } else {
        filteredProblemList = problemList;
    }

    return filteredProblemList;
}

async function queryByPage(filterParam, pageNo, pageSize) {
    let startIdx = (pageNo - 1) * pageSize;
    let endIdx = _.min([startIdx + pageSize, filteredProblemList.length]);

    let result = {
        list: _.slice(filteredProblemList, startIdx, endIdx),
        hasMoreFlag: endIdx < filteredProblemList.length
    };

    return new Promise((resolve, error) => {
        setTimeout(() => {
            resolve(result);
        }, 5000)
    });
}


function buildGame(game) {
    game.chessBoardSizeText = game.chessBoardSize + "路";

    if (!_.isEmpty(game.tags) && game.tags[0] != '') {
        game.tagsText = _.join(game.tags, ",");
    } else {
        game.tagsText = '';
        game.tags = [];
    }

    game.level = (game.level || '0') + "";
    let gameLevel = Constants.LEVEL_OPTIONS[game.level];
    game.levelText = gameLevel.text;
    game.levelIcon = gameLevel.icon;

    if (game.hardFlag == null) {
        game.hardFlag = false;
    }

    game.modifyDateText = DateUtils.convertTimestampToDateText(game.modifyDate);
    game.introValue = "《" + game.book + "》" + game.title;
    game.introLabel = game.modifyDateText + "　　" + game.chessBoardSizeText + "　　" + game.tagsText;

    if (game.nextChessType === 'BLACK') {
        game.nextChessType = 'B';
    } else if (game.nextChessType === 'WHITE') {
        game.nextChessType = 'W';
    }

    if (!game.chessBoard && _.isArray(game.chessList)) {
        let chessBoard = {};
        _.each(game.chessList, (chess) => {
            let key = ChessUtils.getGeoFromPosIdx(game.chessBoardSize, chess.pos);
            chess.geo = key;

            chessBoard[key] = chess;
            delete chess.pos;
        });

        delete game.chessList;
        game.chessBoard = chessBoard;
    }

    _.each(game.chessBoard, (chess, geo) => {
        game.caption = game.caption || '';
        chess.geo = geo;


        if (chess.color) {
            chess.type = _.find(Constants.CHESS_TYPE, {color: chess.color}).value;
            delete chess.color;
            delete chess.markedColor;
        }

        delete chess.fixed;
    });


    delete game.stepList;
    delete game.currNextStep;
}


export default {
    init: init,
    getBooks: getBooks,
    getTags: getTags,
    filterProblemList: filterProblemList,
    queryByPage: queryByPage,
}