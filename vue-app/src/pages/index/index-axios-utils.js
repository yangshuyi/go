import _ from 'lodash';

import Constants from "@/components/Constants";

import {CccisAxiosUtils} from '@cccis/vue3-common';
import RESULT from "@cccis/vue3-common";
import handlerError from "@cccis/vue3-common";

let axios = null;
let remoteServerAddress = "https://aitest.cccdrp.cn/statistics-web"; //http://localhost:8087/drp-statistics";
let key = 'go';

export default {
    init: function (pAxios) {
        axios = pAxios;
        CccisAxiosUtils.init(pAxios);
    },

    loadGameData: function () {
        let timestamp = new Date().getTime();
        //let gameList = CccisAxiosUtils.getData(`https://ipa.cccdrp.cn/dms/sit/data.json?_t=${timestamp}`);
        let gameList = CccisAxiosUtils.getData(`/data.json?_t=${timestamp}`);
        return gameList;
    },

    downloadGameData: async function () {
        let timestamp = new Date().getTime();
        let url = `${remoteServerAddress}/acquisition/system/data/load/${key}?_t=${timestamp}`;

        let data = await CccisAxiosUtils.getData(url);
        if (data == null) {
            return null;
        }

        if (data.value) {
            data.valueObj = JSON.parse(data.value);
        }

        return data;
    },

    uploadGameData: async function (gameList) {
        let url = `${remoteServerAddress}/acquisition/system/data/save`;

        let dataObj = {
            key: key,
            value: JSON.stringify(gameList),
            timestamp: new Date()
        }
        await CccisAxiosUtils.postData(url, dataObj);
    }
};