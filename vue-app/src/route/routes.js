import Constants from "../components/Constants";
import _ from 'lodash';

const routes = [
    {path: "/", redirect: "/index/list"},
    {
        path: "/index",
        name: "index",
        component: async () => {
            return import("@/pages/index/index.vue");
        },
        children: [
            {
                path: 'list',
                name: 'list',
                component: () => import('@/pages/index/list/module-list.vue'),
            },
            {
                path: 'mgmtMobile',
                name: 'mgmtMobile',
                component: () => import('@/pages/index/mgmt/module-mgmt-mobile.vue'),
            },
            {
                path: 'gameMobile',
                name: 'gameMobile',
                component: () => import('@/pages/index/game/module-game-mobile.vue'),
            },
            {
                path: 'mgmtPc',
                name: 'mgmtPc',
                component: () => import('@/pages/index/mgmt/module-mgmt-pc.vue'),
            },
            {
                path: 'gamePc',
                name: 'gamePc',
                component: () => import('@/pages/index/game/module-game-pc.vue'),
            },
        ]
    }
]
export default routes;