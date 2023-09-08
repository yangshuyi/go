import _ from 'lodash';

import {DateUtils, StringUtils} from "sirius-common-utils";
import Constants from "../../Constants";
import DexieDbUtils from "./DexieDbUtils";

let globalDb = null;

async function getGlobalDb() {
    if (!globalDb) {
        globalDb = await DexieDbUtils.getConn();
    }
    return globalDb;
}

async function syncFromRemote(assetList) {
    let problemList = [];
    _.each(assetList, (asset) => {
        problemList.push(asset);
    });

    let db = await getGlobalDb();
    await db.problems.clear();

    for (let i = 0; i < problemList.length; i++) {
        await saveProblem(problemList[i]);
    }
    //await db.problems.bulkPut(problemList);
}

async function filterProblemList(filterParam) {
    let db = await getGlobalDb();
    await db.filteredProblems.clear();

    let filteredList = [];
    if (filterParam) {
        filteredList = await db.problems.toArray();
        filteredList =_.filter(filteredList, (problem) => {
            if (!_.isEmpty(filterParam.books)) {
                if (!_.includes(filterParam.books, problem.book)) {
                    return false;
                }
            }
            if (!_.isEmpty(filterParam.tags)) {
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
        filteredList = await db.problems.toArray();
    }

    let filteredProblemList = [];
    _.each(filteredList, (problem, idx) => {
        filteredProblemList.push({
            orderIdx: idx,
            problemId: problem.problemId,
        })
    });

    await db.filteredProblems.bulkPut(filteredProblemList);
}

async function queryFilteredProblemByPage(pageNo, pageSize) {
    console.log(`queryFilteredProblemByPage: ${pageNo}, ${pageSize}`);

    let offset = (pageNo - 1) * pageSize;
    let endIdx = offset + pageSize;

    let db = await getGlobalDb();

    let totalCnt = await db.filteredProblems.count();
    let list = await db.filteredProblems.offset(offset).limit(pageSize).toArray();
    let problemIdList = _.map(list, 'problemId');

    let problemList = await db.problems.where('problemId').anyOf(problemIdList).toArray();
    _.each(problemList, (problem) => {
        buildProblemFormData(problem);
    });

    return {
        list: problemList,
        hasMoreFlag: endIdx < totalCnt
    };
}

async function queryCount() {
    let db = await getGlobalDb();

    let totalCnt = await db.problems.count();
    return totalCnt;
}

async function loadProblemByFilteredOrderIdx(orderIdx = 0) {
    let db = await getGlobalDb();

    let record = await db.filteredProblems.get(orderIdx);
    if (!record) {
        console.error(`Could not find FilteredProblem by orderIdx: ${orderIdx}`);
        return null;
    }

    return await loadProblemById(record.problemId);
}

async function loadProblemById(problemId) {
    let db = await getGlobalDb();

    let problem = await db.problems.get(problemId);
    if (problem == null) {
        console.error(`Could not find Problem by id: ${problemId}`);
    }

    buildProblemFormData(problem);
    return problem;
}

async function saveProblem(problemParam) {
    let problemEntity = null;
    if (problemParam.problemId) {
        problemEntity = await loadProblemById(problemParam.problemId);
    }
    if (!problemEntity) {
        problemEntity = {};
    }

    problemEntity.id = problemParam.id;
    problemEntity.book = problemParam.book;
    problemEntity.title = problemParam.title;
    problemEntity.desc = problemParam.desc;
    problemEntity.level = problemParam.level;
    problemEntity.tags = problemParam.tags;
    problemEntity.hardFlag = problemParam.hardFlag;
    problemEntity.chessBoardSize = problemParam.chessBoardSize;
    problemEntity.chessBoard = problemParam.chessBoard;
    problemEntity.nextChessType = problemParam.nextChessType;

    let db = await getGlobalDb();
    await db.problems.put(problemEntity);
}

function buildProblemFormData(game) {
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
    if (model == null) {
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

    // TagUtils.formatGameTagsBeforeUpload(model);

    _.each(model.chessBoard, (chess, geo) => {
        delete chess.$geo;
    });
}


export default {
    syncFromRemote: syncFromRemote,

    queryCount: queryCount,

    filterProblemList: filterProblemList,
    queryFilteredProblemByPage: queryFilteredProblemByPage,
    loadProblemByFilteredOrderIdx: loadProblemByFilteredOrderIdx,

    loadProblemById: loadProblemById,
    saveProblem: saveProblem,
}