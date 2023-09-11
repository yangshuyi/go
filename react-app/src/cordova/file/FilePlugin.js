import {CheckCircleFilled, QuestionCircleFilled, StarFilled, WarningFilled} from "@ant-design/icons";

/**
 * https://github.com/apache/cordova-plugin-file-transfer
 */

function isPluginAvailable() {
    return window.requestFileSystem;
}

async function getFile(filePath, options = {create: true, exclusive: false}) {
    return new Promise((resolve, reject) => {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
            console.log('file system open: ' + fs.name);

            fs.getFile(filePath, options, function (fileEntry) {
                resolve(fileEntry);
            });
        });
    })
}

async function createTempFile(dirEntry, fileName, isAppend) {
    return new Promise((resolve, reject) => {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
            // Creates a new file or returns the file if it already exists.
            dirEntry.getFile(fileName, {create: true, exclusive: false}, function (fileEntry) {
                writeFile(fileEntry, null, isAppend);
            });
        });
    })
}

async function readFile(fileEntry) {
    return new Promise((resolve, reject) => {
        fileEntry.file(function (file) {
            let reader = new FileReader();
            reader.onloadend = function() {
                console.log("Successful file read: " + this.result);
                debugger;
                resolve(this.result);
            };
            reader.readAsArrayBuffer(file);

        });
    })
}



export default {
    isPluginAvailable: isPluginAvailable,
    getFile: getFile,
    createTempFile: createTempFile,
    readFile: readFile,
}