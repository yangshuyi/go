
import {createRouter, createWebHashHistory} from 'vue-router'
import routes from './routes.js'
import _ from 'lodash';
import {CccisLoggerUtils} from "@cccis/vue3-common";
import {inject} from "vue";

const router = createRouter({
    history: createWebHashHistory(),  // hash 模式，想要改为history 模式可以使用createWebHistory
    routes: routes,
});

router.beforeEach(function (to, from, next) {
    if(_.find(to.matched, {name: 'index'})){
        if(_.find(from.matched, {name: 'index'})) {
            //功能页面内部跳转
            next();
        }else {
            CccisLoggerUtils.info("从其他页面跳转入功能页面，进行初始化数据处理");
            Promise.all([]).then(() => {
                next();
            });
        }
    }else{
        next();
    }

    next();
});

export default router