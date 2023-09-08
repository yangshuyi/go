import _ from 'lodash';

import {DateUtils, StringUtils} from "sirius-common-utils";
import DexieDbUtils from "../../module/util/DexieDbUtils";
import dayjs from "dayjs";

let globalDb = null;

async function getGlobalDb() {
    if (!globalDb) {
        globalDb = await DexieDbUtils.getConn();
    }
    return globalDb;
}

async function updateDataVersion(dataVersion) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "dataVersion",
        value: dataVersion
    });
}

async function refreshDataVersion() {
    let dataVersion = DateUtils.getCurrentMoment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    await updateDataVersion(dataVersion);
}

async function getDataVersion() {
    let db = await getGlobalDb();
    let record = await db.configs.get("dataVersion")
    return _.get(record, 'value');
}

async function setShowBoardFlag(flag) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "showBoard",
        value: flag
    });
}

async function getShowBoardFlag() {
    let db = await getGlobalDb();
    let record = await db.configs.get("showBoard")
    return _.get(record, 'value', 'false')
}


export default {
    updateDataVersion: updateDataVersion,
    refreshDataVersion: refreshDataVersion,
    getDataVersion: getDataVersion,

    getShowBoardFlag: getShowBoardFlag,
    setShowBoardFlag: setShowBoardFlag,
}