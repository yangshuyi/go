import _ from 'lodash';

import {Octokit} from "octokit";
import {AxiosUtils, DateUtils} from "sirius-common-utils";

let octokit = null;

async function init() {
    octokit = new Octokit({
        auth: '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',
    });
}

async function fetchAllAssets() {
    const octokit = new Octokit({
        auth: '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',
    });

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