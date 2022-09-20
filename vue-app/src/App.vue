<script setup>

import _ from 'lodash';
import {computed, inject, provide, ref, reactive} from 'vue';

import {useRoute, useRouter} from "vue-router";

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
