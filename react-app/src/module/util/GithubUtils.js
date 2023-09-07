import _ from 'lodash';

import {Octokit} from "octokit";
import {AxiosUtils, DateUtils} from "sirius-common-utils";
import {Base64} from "js-base64";

let token = Base64.decode("Z2l0aHViX3BhdF8xMUFCNFNZTUkwZWZ2Z1NQN2RtYjZiX2YxOUxrU2VJeGlvTGpCTlVJVGRodDRLcnQwMUlObGpSaE5IV3JBREZjYWlPNzNEVlJWR3NoTDVEYVRO");

let octokit = null;

async function init() {
    octokit = new Octokit({
        auth: token
    });
}

async function fetchAllAssets() {
    debugger;
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
    debugger;
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