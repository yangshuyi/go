<script setup>

import _ from 'lodash';
import {computed, inject, provide, ref, reactive} from 'vue';

import {useRoute, useRouter} from "vue-router";

import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: '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',
});

let releaseList =await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'yangshuyi',
    repo: 'go',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
});

console.log(JSON.stringify(releaseList, null,4));

let releaseAssetList = await octokit.request('GET /repos/{owner}/{repo}/releases/{release_id}/assets', {
    owner: 'yangshuyi',
    repo: 'go',
    release_id: '119920840',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
});

console.log(JSON.stringify(releaseAssetList, null,4));

let asset  = await octokit.request('GET /repos/{owner}/{repo}/releases/assets/{asset_id}', {
    owner: 'yangshuyi',
    repo: 'go',
    asset_id: '124627038',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
})

console.log(JSON.stringify(asset, null,4));

const windowSize = reactive({});
provide("windowSize", windowSize);

window.addEventListener('resize', _.debounce(resizeLayout, 500));

function resizeLayout() {
  windowSize.timestamp = new Date().getTime(); //当前时间戳，用于刷新动作触发watch
  windowSize.windowWidth = window.innerWidth; //浏览器宽度
  windowSize.windowHeight = window.innerHeight; //浏览器高度
}

</script>

<template>
  <router-view/>
</template>

<style lang="scss">
</style>
