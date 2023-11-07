import _ from 'lodash';

import {DateUtils, StringUtils} from "sirius-common-utils";
import Constants from "../../Constants";
import DexieDbUtils from "./DexieDbUtils";
import ConfigUtils from "../../components/config/ConfigUtils";

let globalDb = null;

async function getGlobalDb() {
    if (!globalDb) {
        globalDb = await DexieDbUtils.getConn();
    }
    return globalDb;
}

async function syncFromRemote(assetList, clearFlag) {
    let problemList = [];
    _.each(assetList, (asset) => {
        problemList.push(asset);
    });

    if (clearFlag) {
        let db = await getGlobalDb();
        await db.problems.clear();
        console.log(`clear all problems`);
    }

    for (let i = 0; i < problemList.length; i++) {
        await saveProblem(problemList[i], false);
    }
    console.log(`save all problems`);
}


async function queryAll() {
    let db = await getGlobalDb();
    let list = await db.problems.toArray();
    return list;
}

async function filterProblemList(filterParam) {
    let db = await getGlobalDb();
    await db.filteredProblems.clear();

    let filteredList = [];
    if (filterParam) {
        filteredList = await db.problems.toArray();
        filteredList = _.filter(filteredList, (problem) => {
            if (!_.isEmpty(filterParam.id)) {
                if (filterParam.id !== problem.id) {
                    return false;
                }
            }
            if (!_.isEmpty(filterParam.books)) {
                if (!_.includes(filterParam.books, problem.book)) {
                    return false;
                }
            }
            if (!_.isEmpty(filterParam.tags)) {
                if (_.isEmpty(_.intersection(filterParam.tags, problem.tags))) {
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

    _.each(filteredList, (problem, idx) => {
        problem.ebbinghausOrder = Constants.EBBINGHAUS_TIMES[problem.ebbinghausTimes || 0].value + (problem.ebbinghausDays || 0);
    });
    filteredList = _.orderBy(filteredList, ['ebbinghausOrder'], ['asc']);

    let filteredProblemList = [];
    _.each(filteredList, (problem, idx) => {
        filteredProblemList.push({
            orderIdx: idx,
            problemId: problem.id,
        })
    });

    filteredProblemList = _.orderBy(filteredProblemList, [''])

    await db.filteredProblems.bulkPut(filteredProblemList);
}

async function queryFilteredProblemByPage(pageNo, pageSize) {
    console.log(`queryFilteredProblemByPage: ${pageNo}, ${pageSize}`);

    let offset = (pageNo - 1) * pageSize;
    let endIdx = offset + pageSize;

    let db = await getGlobalDb();

    let totalCnt = await db.filteredProblems.count();
    let list = await db.filteredProblems.offset(offset).limit(pageSize).toArray();
    let map = {};
    _.each(list, (item) => {
        map[item.problemId] = item.orderIdx;
    })

    let problemList = await db.problems.where('id').anyOf(_.keys(map)).toArray();
    _.each(problemList, (problem) => {
        buildProblemFormData(problem);
        problem.orderIdx = map[problem.id];
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

async function loadProblemById(id) {
    let db = await getGlobalDb();

    let problem = await db.problems.get(id);
    if (problem == null) {
        console.error(`Could not find Problem by id: ${id}`);
        return null;
    }

    buildProblemFormData(problem);
    return problem;
}

async function deleteProblemById(id, needToUpdateVersionFlag = true) {
    let db = await getGlobalDb();

    await db.problems.delete(id);

    if (needToUpdateVersionFlag) {
        await ConfigUtils.refreshDataVersion();
    }
}

async function saveProblem(problemParam, needToUpdateVersionFlag = true) {
    let db = await getGlobalDb();

    let problemEntity = null;
    if (problemParam.id) {
        problemEntity = await db.problems.get(problemParam.id);
        if (!problemEntity) {
            problemEntity = {
                id: problemParam.id,
            };
        }
    } else {
        problemEntity = {
            id: "" + DateUtils.getCurrentDate().getTime()
        };
    }

    problemEntity.book = problemParam.book;
    problemEntity.title = problemParam.title;
    problemEntity.desc = problemParam.desc;
    problemEntity.level = problemParam.level;
    problemEntity.tags = problemParam.tags;
    problemEntity.hardFlag = problemParam.hardFlag;
    problemEntity.chessBoardSize = problemParam.chessBoardSize;
    problemEntity.chessBoard = problemParam.chessBoard;
    problemEntity.nextChessType = problemParam.nextChessType;
    problemEntity.modifyDate = problemParam.modifyDate || DateUtils.getCurrentDate().getTime();

    problemEntity.ebbinghausTimes = problemEntity.ebbinghausTimes || 0;
    //做对一次times+1, 做错一次times-1
    if (problemEntity.level === Constants.LEVEL_OPTIONS["2"].value) {
        problemEntity.ebbinghausTimes = problemEntity.ebbinghausTimes - 1;
        if (problemEntity.ebbinghausTimes < 0) {
            problemEntity.ebbinghausTimes = 0;
        }
    } else if (problemEntity.level === Constants.LEVEL_OPTIONS["0"].value) {
        problemEntity.ebbinghausTimes = problemEntity.ebbinghausTimes + 1;
        if (problemEntity.ebbinghausTimes > 5) {
            problemEntity.ebbinghausTimes = 5;
        }
    }
    problemEntity.ebbinghausDays = Math.floor(DateUtils.getCurrentDate().getTime() / 86400000);

    await db.problems.put(problemEntity);

    if (needToUpdateVersionFlag) {
        await ConfigUtils.refreshDataVersion();
    }
}

function generateNewGameTitle(oldTitle) {
    let array = _.split(oldTitle, '-');
    let lastTitleSegment = array[array.length - 1];

    let number = _.toNumber(lastTitleSegment);
    if (!Number.isNaN(number)) {
        array[array.length - 1] = number + 1;
    }
    return _.join(array, '-');
}


function buildProblemFormData(game) {
    game.$chessBoardSizeText = game.chessBoardSize + "路";

    if (!_.isEmpty(game.tags) && game.tags[0] !== '') {
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

export default {
    syncFromRemote: syncFromRemote,

    queryCount: queryCount,
    queryAll: queryAll,

    filterProblemList: filterProblemList,
    queryFilteredProblemByPage: queryFilteredProblemByPage,
    loadProblemByFilteredOrderIdx: loadProblemByFilteredOrderIdx,

    loadProblemById: loadProblemById,
    saveProblem: saveProblem,
    deleteProblemById: deleteProblemById,

    generateNewGameTitle: generateNewGameTitle,
}