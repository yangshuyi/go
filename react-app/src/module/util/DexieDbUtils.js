import _ from 'lodash';

import {Octokit} from "octokit";
import {AxiosUtils, DateUtils} from "sirius-common-utils";
import {Base64} from "js-base64";
import Dexie from "dexie";

let globalDb = null;

async function init() {
    globalDb = new Dexie('GO');
    globalDb.version(1).stores({
        problems: 'id',
        filteredProblems: 'orderIdx',
        books: 'bookName',
        tags: 'tagName',
        configs: 'key',
    });
    return globalDb;
}

async function getConn() {
    if (globalDb == null) {
        return init();
    }
    return globalDb;
}


export default {
    init: init,

    getConn: getConn,

}