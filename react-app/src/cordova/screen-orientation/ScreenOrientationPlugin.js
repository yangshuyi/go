/**
 * https://github.com/apache/cordova-plugin-screen-orientation
 */

function isPluginAvailable() {
    return window.screen?.orientation;
}

function lockPortrait() {
    if (!isPluginAvailable()) {
        return;
    }

    window.screen.orientation.lock('portrait')
}

function lockHorizontal() {
    if (!isPluginAvailable()) {
        return;
    }

    window.screen.orientation.lock('landscape')
}

export default {
    isPluginAvailable: isPluginAvailable,
    lockPortrait: lockPortrait,
    lockHorizontal: lockHorizontal,
}