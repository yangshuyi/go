import _ from 'lodash';

import {Octokit} from "octokit";
import {AxiosUtils, DateUtils} from "sirius-common-utils";
import {Base64} from "js-base64";

let destToken = "dSMjI2gjIyMzIyMjVCMjI3QjIyM5IyMjMCMjI2EjIyNwIyMjWiMjI1QjIyNSIyMjeSMjI28jIyNWIyMjUiMjI0IjIyN4IyMjRSMjI1MjIyNhIyMjbCMjI1YjIyNTIyMjUSMjI1ojIyMxIyMjYSMjI3EjIyMxIyMjayMjI2MjIyNGIyMjRiMjI1YjIyNVIyMjayMjI0IjIyN6IyMjVSMjIzIjIyM0IyMjRyMjI1YjIyNXIyMjTiMjI1QjIyNTIyMjUCMjI04jIyNUIyMjUiMjI3cjIyMxIyMjbSMjI2QjIyMwIyMjOCMjI1cjIyNiIyMjWSMjI04jIyNHIyMjVyMjIzIjIyNvIyMjayMjI1kjIyNpIyMjSiMjI1cjIyNPIyMjMCMjI0UjIyNUIyMjZCMjI1cjIyNWIyMjMCMjI1gjIyNEIyMjWiMjI0cjIyNPIyMjVSMjI2wjIyMzIyMjTiMjI0kjIyNKIyMjVSMjI2UjIyNIIyMjcCMjI1YjIyNXIyMjdyMjI2sjIyNVIyMjVCMjI1ojIyNOIyMjRiMjI04jIyNDIyMjRiMjI1UjIyNNIyMjeCMjIzgjIyNGIyMjZCMjI2gjIyNCIyMjMyMjI1gjIyNpIyMjViMjI0gjIyNhIyMjMCMjI2wjIyMyIyMjWg==";
let octokit = null;

async function init() {
    octokit = new Octokit({
        auth: getToken(destToken)
    });
}

function genToken() {
    let originalToken = "";
    let token4 = Base64.encode(originalToken);
    let token3 = _.split(token4, "");
    let token2 = _.reverse(token3);
    let token1 = _.join(token2, "###");
    let destToken = Base64.encode(token1);
    console.log(destToken);
}

function getToken() {
    let token1 = Base64.decode(destToken);
    let token2 = _.split(token1,"###");
    let token3 = _.reverse(token2);
    let token4 = _.join(token3,'');
    let token = Base64.decode(token4);
    return token;
}

async function fetchAllAssets() {
    let releaseListResp = await octokit.request('GET /repos/{owner}/{repo}/releases', {
        owner: 'yangshuyi',
        repo: 'go',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    if (!releaseListResp) {
        return;
    }

    let releaseList = _.map(_.get(releaseListResp, 'data'), (releaseItem) => {
        return {
            releaseId: releaseItem.id,
            releaseName: releaseItem.name,
            publishedDate: releaseItem.published_at,
            assets: _.map(releaseItem.assets, (assetItem) => {
                return {
                    assetId: assetItem.id,
                    assetName: assetItem.name,
                    size: assetItem.size,
                    createDate: assetItem.created_at,
                    updatedDate: assetItem.updated_at,
                    downloadUrl: assetItem.browser_download_url,
                }
            })
        }
    });

    releaseList = _.orderBy(releaseList, ['publishedDate'], ['desc']);

    if (_.isEmpty(releaseList)) {
        return [];
    }
    return releaseList[0].assets;
}

async function downloadAssetData(assetDownloadUrl) {
    let assetData = await AxiosUtils.getFormData(assetDownloadUrl + `?_t=${new Date().getTime()}`);
    return assetData;
}

// downloadGameData: async function () {
// let timestamp = new Date().getTime();
// let url = `${remoteServerAddress}/acquisition/system/data/load/${key}?_t=${timestamp}`;
//
// let data = await CccisAxiosUtils.getData(url);
// if (data == null) {
//     return null;
// }
//
// if (data.value) {
//     data.valueObj = JSON.parse(data.value);
// }
//
// CccisLoggerUtils.debug(JSON.stringify(data.valueObj));
//
// return data.valueObj ;
// }
// ,
//
// uploadGameData: async function (dataList) {
// let url = `${remoteServerAddress}/acquisition/system/data/save`;
//
// let dataObj = {
//     key: key,
//     value: JSON.stringify(dataList),
//     timestamp: new Date()
// }
// await CccisAxiosUtils.postData(url, dataObj);
// }
// }
// ;

export default {
    init: init,
    fetchAllAssets: fetchAllAssets,
    downloadAssetData: downloadAssetData,
}