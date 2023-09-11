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

export default {
    isPluginAvailable: isPluginAvailable,
    download: download,
}