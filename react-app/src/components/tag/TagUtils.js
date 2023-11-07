import _ from 'lodash';

import {DateUtils, StringUtils} from "sirius-common-utils";
import DexieDbUtils from "../../module/util/DexieDbUtils";

let tagMapCache = [];

async function syncFromRemote(problemList) {
    let tagMap = {};
    _.each(problemList, (problem) => {
        _.each(problem.tags, (tag) => {
            if (!tag) {
                return;
            }
            let tagObj = tagMap[tag];
            if (!tagObj) {
                tagObj = {
                    tagName: tag,
                    problemCnt: 0,
                    keyword: StringUtils.buildKeyword(tag)
                };
                tagMap[tag] = tagObj;
            }
            tagObj.problemCnt++;
        });
    });
    let tagList = _.values(tagMap);
    tagList = _.orderBy(tagList, ['problemCnt'], ['desc']);

    let db = await DexieDbUtils.getConn();
    await db.tags.clear();
    await db.tags.bulkPut(tagList);

    await init();
}

async function init() {
    let db = await DexieDbUtils.getConn();
    let tagList = await db.tags.toArray();

    tagMapCache = {};
    _.each(tagList, (tag) => {
        tagMapCache[tag.tagName] = tag;
    });
}

function getTags() {
    let tags = _.map(tagMapCache);
    return tags;
}

function getTagOptions() {
    let tags = getTags();
    _.each(tags, (tag)=>{
        if(tag.problemCnt === 0) {
            tag.$orderIdx = Number.MAX_VALUE;
        }else{
            tag.$orderIdx =tag.problemCnt;
        }
    })
    return _.orderBy(tags, ['$orderIdx'], ['desc']);
}

async function saveTag(tagParam) {
    let tagEntity = tagMapCache[tagParam.tagName];
    if (!tagEntity) {
        tagEntity = {};
    }
    tagEntity.tagName = tagParam.tagName;
    tagEntity.problemCnt = tagParam.problemCnt || 0;
    tagEntity.keyword = tagParam.keyword;

    let db = await DexieDbUtils.getConn();
    await db.tags.put(tagEntity);

    await init();
}

//
// function formatGameTagsBeforeUpload(game) {
//     delete game.tagsText;
//
//     if (game.tags && game.tags.length == 0) {
//         delete game.tags;
//         return;
//     }else {
//         //修正Tag数据
//         let str = _.join(game.tags, ",");
//         str = str.replaceAll("，", ",");
//         str = str.replaceAll(" ", "");
//         str = str.replaceAll(",,", ",");
//         game.tags = _.split(str, ",");
//     }
// }
//
// function appendDescIntoTags(game) {
//     if (game.desc.indexOf('逃子') >= 0) {
//         appendTag(game, '逃子');
//     }
//     if (game.desc.indexOf('杀棋') >= 0) {
//         appendTag(game, '杀棋');
//     }
//     if (game.desc.indexOf('扑') >= 0) {
//         appendTag(game, '扑吃');
//     }
//     if (game.desc.indexOf('做活') >= 0) {
//         appendTag(game, '做活');
//     }
//     if (game.desc.indexOf('接不归') >= 0) {
//         appendTag(game, '接不归');
//     }
//     if (game.desc.indexOf('制造') >= 0) {
//         appendTag(game, '制造');
//     }
//     if (game.desc.indexOf('扑吃') >= 0) {
//         appendTag(game, '扑吃');
//     }
//     if (game.desc.indexOf('征吃') >= 0) {
//         appendTag(game, '征吃');
//     }
//     if (game.desc.indexOf('门吃') >= 0) {
//         appendTag(game, '门吃');
//     }
//     if (game.desc.indexOf('抱吃') >= 0) {
//         appendTag(game, '抱吃');
//     }
//     if (game.desc.indexOf('虎') >= 0) {
//         appendTag(game, '虎');
//     }
//     if (game.desc.indexOf('双') >= 0) {
//         appendTag(game, '双');
//     }
//     if (game.desc.indexOf('向下') >= 0) {
//         appendTag(game, '向下打吃');
//     }
// }
//
// function getAllTags(gameList) {
//     let tagArray = [];
//     _.each(gameList, (game) => {
//         tagArray.push(...game.tags);
//     });
//     tagArray = _.uniq(tagArray);
//     console.log("AllTags: \n" + _.join(tagArray, "\n"));
//     return tagArray;
// }
//
// function custom(gameList) {
//     //统计备注和标签
//     let desc = [];
//     _.each(gameList, (game) => {
//         desc.push(game.desc);
//     });
//     desc = _.uniq(desc);
//     console.log(_.join(desc, "\n"));
//
//
//     //统计备注和标签
//     _.each(gameList, (game) => {
//         removeTag(game, '制造倒扑');
//     });
//
//     let tag = [];
//     _.each(gameList, (game) => {
//         tag.push(...game.tags);
//     });
//     tag = _.uniq(tag);
//     console.log(_.join(tag, "\n"));
// }
//
// function hasTag(game, tag) {
//     return _.includes(game.tags, tag);
// }
//
//
// function appendTag(game, tag) {
//     if (!_.includes(game.tags, tag)) {
//         game.tags = game.tags || [];
//         game.tags.push(tag);
//     }
// }
//
// function updateTag(game, oldTag, newTag) {
//     let removed = removeTag(game, oldTag);
//     if (removed) {
//         appendTag(game, newTag);
//     }
// }
//
// function removeTag(game, oldTag) {
//     game.tags = game.tags || [];
//     if (_.includes(game.tags, oldTag)) {
//         _.pull(game.tags, oldTag);
//         return true;
//     } else {
//         return false;
//     }
// }
export default {
    syncFromRemote: syncFromRemote,
    init: init,
    getTags: getTags,
    getTagOptions: getTagOptions,
    saveTag: saveTag,
}