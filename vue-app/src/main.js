import * as Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './route';
import CccisVue3Common, {CccisAppUtils, CccisCfgUtils, CccisLoggerUtils, CccisExplorerUtils} from '@cccis/vue3-common';

import IndexAxiosUtils from "@/pages/index/index-axios-utils";

import {Collapse, CollapseItem , Picker, Popup, ActionBar, ActionBarIcon, ActionBarButton,  Icon, Toast , Button, NavBar,List, Cell, SwipeCell,Field, CellGroup, Tag, Switch,RadioGroup, Radio,Space,Row,Col    } from 'vant';

axios.defaults.baseURL = import.meta.env.VITE_APP_AXIOS_BASE_URL;
axios.defaults.withCredentials=true;

const app = Vue.createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.use(CccisVue3Common);

import 'vant/lib/index.css';
app.use(Collapse).use(CollapseItem).use(Picker).use(Popup).use(Icon).use(Toast).use(Button).use(NavBar).use(List).use(Cell).use(SwipeCell).use(Field).use(Tag).use(CellGroup).use(Switch).use(RadioGroup).use(Radio).use(Space).use(Row).use(Col);
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);

app.provide('axios', app.config.globalProperties.axios);
app.mount('#app')

IndexAxiosUtils.init(axios);

CccisCfgUtils.appInfo.appName = 'GO';

CccisCfgUtils.ajax.sessionEnabled = false; //是否启用Session用户认证
CccisCfgUtils.ajax.jwtEnabled = false; //是否启用JWT用户认证

CccisLoggerUtils.init(null, "DEBUG", "BATCH");

let scale = "1.0";
if(window.innerWidth>1000){
    scale = "2.0"; //1308*1685 1651*2127 (1.26)
}

CccisAppUtils.setLocalStorageStringItem("scale", scale);

CccisExplorerUtils.updateViewPort({
    "initial-scale": scale,
    "minimum-scale": scale,
    "maximum-scale": scale
});



