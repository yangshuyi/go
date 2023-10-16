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
    return _.get(record, 'value', true)
}

async function setScreenOrientationLandscape(screenOrientationLandscape) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "screenOrientationLandscape",
        value: screenOrientationLandscape
    });
}

async function getScreenOrientationLandscape() {
    let db = await getGlobalDb();
    let record = await db.configs.get("screenOrientationLandscape")
    return _.get(record, 'value', true)
}

async function setGithubReleaseId(releaseId) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "githubReleaseId",
        value: releaseId
    });
}

async function getGithubReleaseId() {
    let db = await getGlobalDb();
    let record = await db.configs.get("githubReleaseId")
    return _.get(record, 'value')
}

async function setGithubAssetId(assetId) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "githubAssetId",
        value: assetId
    });
}

async function getGithubAssetId() {
    let db = await getGlobalDb();
    let record = await db.configs.get("githubAssetId")
    return _.get(record, 'value')
}

async function setGithubAssetName(assetName) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "githubAssetName",
        value: assetName
    });
}

async function getGithubAssetName() {
    let db = await getGlobalDb();
    let record = await db.configs.get("githubAssetName")
    return _.get(record, 'value')
}

async function setGithubAssetUploadUrl(assetUploadUrl) {
    let db = await getGlobalDb();
    await db.configs.put({
        key: "githubAssetUploadUrl",
        value: assetUploadUrl
    });
}

async function getGithubAssetUploadUrl() {
    let db = await getGlobalDb();
    let record = await db.configs.get("githubAssetUploadUrl")
    return _.get(record, 'value')
}


export default {
    updateDataVersion: updateDataVersion,
    refreshDataVersion: refreshDataVersion,
    getDataVersion: getDataVersion,

    getShowBoardFlag: getShowBoardFlag,
    setShowBoardFlag: setShowBoardFlag,

    getScreenOrientationLandscape: getScreenOrientationLandscape,
    setScreenOrientationLandscape: setScreenOrientationLandscape,

    setGithubReleaseId: setGithubReleaseId,
    getGithubReleaseId: getGithubReleaseId,

    setGithubAssetId: setGithubAssetId,
    getGithubAssetId: getGithubAssetId,

    setGithubAssetName: setGithubAssetName,
    getGithubAssetName: getGithubAssetName,

    setGithubAssetUploadUrl: setGithubAssetUploadUrl,
    getGithubAssetUploadUrl: getGithubAssetUploadUrl,
}