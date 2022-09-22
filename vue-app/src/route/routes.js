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
                path: 'mgmt',
                name: 'mgmt',
                component: () => import('@/pages/index/mgmt/module-mgmt.vue'),
            },
            {
                path: 'game',
                name: 'game',
                component: () => import('@/pages/index/game/module-game.vue'),
            },
        ]
    }
]
export default routes;