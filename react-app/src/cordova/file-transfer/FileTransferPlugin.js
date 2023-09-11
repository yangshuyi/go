import {CheckCircleFilled, QuestionCircleFilled, StarFilled, WarningFilled} from "@ant-design/icons";

/**
 * https://github.com/apache/cordova-plugin-file-transfer
 */

function isPluginAvailable() {
    try{
        new FileTransfer();
        return true;
    }catch (e){
        return false;
    }

}

async function upload(fileUrl, serverUrl, options){
    if(!isPluginAvailable()){
        return;
    }

    let fileTransfer = new FileTransfer();
    let fileUploadOptions = new FileUploadOptions();
    if(options){
        _.assign(fileUploadOptions, options);
    }

    return new Promise((resolve, reject)=>{
        fileTransfer.upload(fileUrl, encodeURI(serverUrl), (response)=>{
            debugger;
            resolve(response.response);
        }, (error)=>{
            debugger;
            resolve(error.code);
        }, fileUploadOptions);
    })
}


async function download(url, targetFileEntry, trustAllHosts, options){
    if(!isPluginAvailable()){
        return;
    }

    let fileTransfer = new FileTransfer();

    return new Promise((resolve, reject)=>{
        fileTransfer.upload(encodeURI(url), targetFileEntry.toUrl(),(entry)=>{
            console.log("download complete: " + entry.toURL());
            debugger;
            resolve(entry);
        }, (error)=>{
            debugger;
            resolve(error.code);
        }, trustAllHosts, options);
    })
}

export default {
    isPluginAvailable: isPluginAvailable,
    upload: upload,
    download: download,
}