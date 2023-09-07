import _ from 'lodash';

import {DateUtils, StringUtils} from "sirius-common-utils";
import Constants from "../../Constants";
import TagUtils from "./TagUtils";

let problemMap = [];
let bookList = [];
let tagList = [];
let filteredProblemList = [];

function init(assetList) {

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
        buildProblemFromRemote(problem);
        problemMap[problem.id] = problem;

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
        filteredProblemList = _.filter(problemMap, (problem) => {
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
        filteredProblemList = _.values(problemMap);
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

async function loadProblemById(problemId) {
    let problem = problemMap[problemId];
    if (problem == null) {
        console.error(`Could not find Problem by id: ${problemId}`);
    }
    return problem;
}

async function saveProblem(problemParam) {
    let problem = null;
    if (problemParam.id) {
        problem = problemMap[problemParam.id];
    }

    buildProblemToRemote(problem, problemParam);



    return problem;
}

function buildProblemFromRemote(game) {
    game.$chessBoardSizeText = game.chessBoardSize + "路";

    if (!_.isEmpty(game.tags) && game.tags[0] != '') {
        game.$tagsText = _.join(game.tags, ",");
    } else {
        game.$tagsText = '';
        game.tags = [];
    }

    game.level = (game.level || '0') + "";
    let gameLevel = Constants.LEVEL_OPTIONS[game.level];
    game.$levelText = gameLevel.text;
    game.$levelIcon = gameLevel.icon;

    if (game.hardFlag == null) {
        game.hardFlag = false;
    }

    game.$modifyDateText = DateUtils.convertTimestampToDateText(game.modifyDate);
    game.$introValue = "《" + game.book + "》" + game.title;
    game.$introLabel = game.$modifyDateText + "　　" + game.$chessBoardSizeText + "　　" + game.$tagsText;
    game.$visited = false;

    if (game.nextChessType === 'BLACK') {
        game.nextChessType = 'B';
    } else if (game.nextChessType === 'WHITE') {
        game.nextChessType = 'W';
    }

    _.each(game.chessBoard, (chess, geo) => {
        chess.$geo = geo;
    });


    delete game.stepList;
    delete game.currNextStep;
}

async function buildProblemToRemote(model, param) {
    if(model==null){
        model = {};
        model.id = new Date().getTime() + "";
    }
    model.book = param.book;
    model.title = param.title;
    model.desc = param.desc;
    model.modifyDate = DateUtils.getCurrentDate().getTime();
    model.chessBoardSize = param.chessBoardSize;
    model.tags = param.tags;
    model.level = param.level;
    model.hardFlag = param.hardFlag;
    model.nextChessType = param.nextChessType;
    model.chessBoard = param.chessBoard;

    TagUtils.formatGameTagsBeforeUpload(model);

    _.each(model.chessBoard, (chess, geo) => {
        delete chess.$geo;
    });
}


export default {
    init: init,
    getBooks: getBooks,
    getTags: getTags,
    filterProblemList: filterProblemList,
    queryByPage: queryByPage,
    loadProblemById: loadProblemById,
    saveProblem: saveProblem,
}