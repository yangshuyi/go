import {CheckCircleFilled, QuestionCircleFilled, StarFilled, WarningFilled} from "@ant-design/icons";

/**
 * https://github.com/apache/cordova-plugin-file-transfer
 */

function isPluginAvailable() {
    return window.cordovaFetch;
}

async function download(url){
    if(!isPluginAvailable()){
        return;
    }

    let response  = await cordovaFetch(url);
    return response.json();
}

async function upload(url, body, headers){
    if(!isPluginAvailable()){
        return;
    }

    let response  = await cordovaFetch(url, {
        method: 'POST',
        body: body,
        headers: headers
    });
    return response.json();
}

export default {
    isPluginAvailable: isPluginAvailable,
    download: download,
    upload: upload,
}