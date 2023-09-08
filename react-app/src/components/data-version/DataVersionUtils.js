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
    await db.dataVersion.clear();
    await db.dataVersion.put({
        id: DateUtils.getCurrentDate().getTime(),
        dataVersion: dataVersion
    });
}

async function refreshDataVersion() {
    let dataVersion = DateUtils.getCurrentMoment().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    await updateDataVersion(dataVersion);
}

async function getDataVersion() {
    let db = await getGlobalDb();
    let list = await db.dataVersion.toArray();
    if (_.isEmpty(list)) {
        return null;
    }
    return list[0].dataVersion;
}


export default {
    updateDataVersion: updateDataVersion,
    refreshDataVersion: refreshDataVersion,
    getDataVersion: getDataVersion,
}