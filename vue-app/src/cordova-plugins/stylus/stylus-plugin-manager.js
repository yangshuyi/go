/**
 * 提供获取手写笔的触控功能
 * 对插件cordova-plugin-stylus进行封装
 * 参考文档：https://github.com/ItsEcholot/cordova-plugin-stylus
 */

import {CccisLoggerUtils} from "@cccis/vue3-common";

export default {
    isPluginAvailable: function () {
        if (window.StylusPlugin == null) {
            CccisLoggerUtils.debug("【stylus-plugin-manager】window.StylusPlugin NULL");
            return false;
        }
        return true;
    },

    init: function(){
        CccisLoggerUtils.debug("【stylus-plugin-manager】init");

        if (!this.isPluginAvailable()) {
            return;
        }

        document.addEventListener('stylusplugin-up', event => {
            console.dir(event);
        });
        document.addEventListener('stylusplugin-down', event => {
            console.dir(event);
        });
        document.addEventListener('stylusplugin-move', event => {
            console.dir(event);
        });
    },
}
