console.log("hello");
import * as Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import App from './App.vue';
import router from './route';
import CccisVue3Common from '@cccis/vue3-common';
import {CccisCfgUtils} from '@cccis/vue3-common';
import IndexAxiosUtils from "@/pages/index/index-axios-utils";

axios.defaults.baseURL = import.meta.env.VITE_APP_AXIOS_BASE_URL;
axios.defaults.withCredentials=true;

const app = Vue.createApp(App);
app.use(VueAxios, axios);
app.use(router);
app.use(CccisVue3Common);

app.provide('axios', app.config.globalProperties.axios);
app.mount('#app')

IndexAxiosUtils.init(axios);

CccisCfgUtils.appInfo.appName = 'GO';

CccisCfgUtils.ajax.sessionEnabled = false; //是否启用Session用户认证
CccisCfgUtils.ajax.jwtEnabled = false; //是否启用JWT用户认证



