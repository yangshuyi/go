import _ from 'lodash';

import Constants from "@/components/Constants";

import {CccisAxiosUtils} from '@cccis/vue3-common';
import RESULT from "@cccis/vue3-common";
import handlerError from "@cccis/vue3-common";

let axios = null;

export default {
    init: function (pAxios) {
        axios = pAxios;
        CccisAxiosUtils.init(pAxios);
    },

    loadGameData: function () {
        let timestamp = new Date().getTime();
        let gameList = CccisAxiosUtils.getData(`https://ipa.cccdrp.cn/dms/sit/data.json?_t=${timestamp}`);
        return gameList;
    }

};
