import _ from 'lodash';

import {Octokit} from "octokit";
import {AxiosUtils, DateUtils} from "sirius-common-utils";

import {Base64} from "js-base64";
import ConfigUtils from "../../components/config/ConfigUtils";
import FetchPlugin from "../../cordova/fetch/FetchPlugin";

let destToken = "RyMjI1ojIyNGIyMjZCMjI00jIyNOIyMjayMjI2UjIyNMIyMjaCMjI1YjIyNVIyMjMiMjI0EjIyNsIyMjTiMjIzIjIyNZIyMjRSMjI1MjIyNKIyMjTiMjI1UjIyNUIyMjWiMjI1IjIyMxIyMjVCMjI1UjIyNsIyMjeiMjI2EjIyN3IyMjaCMjI0YjIyNNIyMjMSMjI3MjIyMyIyMjViMjIzEjIyNSIyMjSCMjI2MjIyN3IyMjSiMjI1UjIyNkIyMjYSMjI0YjIyMxIyMjTiMjI2gjIyM1IyMjMCMjI1EjIyMzIyMjWSMjIzAjIyNNIyMjeCMjIzQjIyNVIyMjUyMjIzIjIyNWIyMjRyMjI04jIyM1IyMjTiMjI0cjIyNhIyMjUCMjI0IjIyNsIyMjWSMjI1ojIyNwIyMjMyMjI1gjIyNQIyMjZCMjI1cjIyNZIyMjdSMjI3AjIyNtIyMjYiMjI3ojIyNZIyMjMCMjI2MjIyM2IyMjRiMjI2wjIyNZIyMjdyMjI2sjIyNVIyMjVCMjI1ojIyNOIyMjRiMjI04jIyNDIyMjRiMjI1UjIyNNIyMjeCMjIzgjIyNGIyMjZCMjI2gjIyNCIyMjMyMjI1gjIyNpIyMjViMjI0gjIyNhIyMjMCMjI2wjIyMyIyMjWg==";
let globalOctokit = null;

let onlineFlag = false;

/**
 * https://docs.github.com/en/rest?ref=daveabrock.com&apiVersion=2022-11-28
 */

async function init() {
    //genToken();
    globalOctokit = new Octokit({
        auth: getToken(destToken)
    });
}

async function getOctokit() {
    if (!globalOctokit) {
        await init();
    }
    return globalOctokit;
}

function genToken() {
    let originalToken = "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";
    let token4 = Base64.encode(originalToken);
    let token3 = _.split(token4, "");
    let token2 = _.reverse(token3);
    let token1 = _.join(token2, "###");
    let destToken = Base64.encode(token1);
    console.log(destToken);
}

function getToken() {
    let token1 = Base64.decode(destToken);
    let token2 = _.split(token1, "###");
    let token3 = _.reverse(token2);
    let token4 = _.join(token3, '');
    let token = Base64.decode(token4);
    return token;
}

async function fetchAllAssets() {
    let octokit = await getOctokit();
    let releaseListResp = await octokit.request(`GET /repos/{owner}/{repo}/releases??_t=${new Date().getTime()}`, {
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
                    assetLabel: assetItem.label,
                    size: assetItem.size,
                    createDate: assetItem.created_at,
                    updatedDate: assetItem.updated_at,
                    downloadUrl: assetItem.browser_download_url,
                }
            }),
            assetUploadUrl: releaseItem.upload_url
        }
    });

    releaseList = _.orderBy(releaseList, ['publishedDate'], ['desc']);

    if (_.isEmpty(releaseList)) {
        return [];
    }

    let release = releaseList[0];

    await ConfigUtils.setGithubReleaseId(release.releaseId);
    await ConfigUtils.setGithubAssetUploadUrl(release.assetUploadUrl);

    let assets = _.orderBy(release.assets, ['updatedDate'], ['desc']);
    return assets;
}

async function downloadAssetData(assetDownloadUrl) {
    let assetData = null;
    if (FetchPlugin.isPluginAvailable()) {
        assetData = await FetchPlugin.download(assetDownloadUrl);
        //console.log("assetData:" + JSON.stringify(assetData));
    } else {
        let headers = {
            'Content-Type': 'application/octet-stream',
            'accept': 'application/vnd.github+json',
        }
        assetData = await AxiosUtils.getFormData(assetDownloadUrl + `?_t=${new Date().getTime()}`, headers);
    }
    return assetData;
}

async function uploadAssetData(assetData) {
    let assetUploadUrl = await ConfigUtils.getGithubAssetUploadUrl();
    let localDataVersion = await ConfigUtils.getDataVersion();

    let blob = new Blob([JSON.stringify(assetData)], {type: "text/json"});

    if (FetchPlugin.isPluginAvailable()) {
        assetUploadUrl = assetUploadUrl.replace("{?name,label}", "?name=" + localDataVersion + ".json" + "&label=" + localDataVersion);

        let headers = {
            'Authorization': 'token ' + getToken(destToken),
        }

        console.log('url:' + assetUploadUrl);
        await FetchPlugin.upload(assetUploadUrl, JSON.stringify(assetData), headers);
    } else {
        let octokit = await getOctokit();
        await octokit.request({
            method: "POST",
            url: assetUploadUrl,
            headers: {
                "content-type": "text/plain",
            },
            mode: 'no-cors',
            data: blob,
            name: localDataVersion + ".json",
            label: localDataVersion,
        });
    }


}

async function loadRemoteDataInfo() {
    let assetList = await fetchAllAssets();
    // if (assetList.length > 1) {
    //     console.log(`Found multiple asset list: ${_.map(assetList, 'assetName')}`);
    // }

    //永远取最新的数据包
    let asset = assetList[0];

    await ConfigUtils.setGithubAssetId(asset.assetId);
    await ConfigUtils.setGithubAssetName(asset.assetName);

    let assetData = await downloadAssetData(asset.downloadUrl);

    return {
        dataVersion: asset.assetLabel,
        assetData: assetData,
        count: assetData.length,
    }
}

export default {
    init: init,
    fetchAllAssets: fetchAllAssets,
    downloadAssetData: downloadAssetData,
    loadRemoteDataInfo: loadRemoteDataInfo,
    uploadAssetData: uploadAssetData,
}