/**
 * 提供切换横竖屏功能
 * 对插件cordova-plugin-screen-orientation进行封装
 * 参考文档：https://github.com/apache/cordova-plugin-screen-orientation
 */

import {CccisLoggerUtils} from "@cccis/vue3-common";

export default {
    isPluginAvailable: function () {
        if (window.screen == null) {
            CccisLoggerUtils.debug("【screen-orientation-plugin-manager】window.screen NULL");
            return false;
        }
        if (window.screen.orientation == null) {
            CccisLoggerUtils.debug("【screen-orientation-plugin-manager】window.screen.orientation NULL");
            return false;
        }
        if (window.screen.orientation.lock == null) {
            CccisLoggerUtils.debug("【screen-orientation-plugin-manager】window.screen.orientation.lock NULL");
            return false;
        }

        return true;
    },

    portrait: function () {
        if (!this.isPluginAvailable()) {
            return;
        }
        return new Promise((resolve, reject) => {
            try {
                window.screen.orientation.lock('portrait-primary')
                    .then(
                        success => {
                            CccisLoggerUtils.debug("【screen-orientation-plugin-manager】PORTRAIT设置成功");
                            resolve(true);
                        },
                        failure => {
                            CccisLoggerUtils.error("【screen-orientation-plugin-manager】PORTRAIT设置失败：" + failure);
                            resolve(false);
                        }
                    );
                CccisLoggerUtils.debug("【screen-orientation-plugin-manager】PORTRAIT设置");
            } catch (e) {
                CccisLoggerUtils.debug("【screen-orientation-plugin-manager】插件不可用," + e);
            }
        });
    },
    landscape: function () {
        if (!this.isPluginAvailable()) {
            return;
        }

        try {
            window.screen.orientation.lock('landscape-primary');
            CccisLoggerUtils.debug("【screen-orientation-plugin-manager】LANDSCAPE设置");
        } catch (e) {
            CccisLoggerUtils.debug("【screen-orientation-plugin-manager】插件不可用," + e);
        }

    },
}
