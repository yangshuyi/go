<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import screenOrientationPluginManager from "@/cordova-plugins/screen-orientation/screen-orientation-plugin-manager";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";


let data = reactive({
  games: [],
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  screenOrientationPluginManager.portrait();
  await init();
});

async function init() {
  data.games = GameUtils.fetchAllGames();
}

async function refresh() {
  await GameUtils.init();
  await init();
}

function enterGame(game) {
  router.push({name: 'gameMobile', query: {gameId: game.id}});
}

function mgmtGame(game) {
  router.push({name: 'mgmtPc', query: {gameId: game?.id}});
}

</script>

<template>
  <div class="module-mgmt">
    <van-nav-bar :fixed="true" :placeholder="true"
                 left-text="刷新" @click-left="refresh()"
                 title="棋局列表"
                 right-text="新增棋局" right-arrow @click-right="mgmtGame(null)"
    />
    <van-list>
      <template v-for="game in data.games">
        <van-swipe-cell>
          <van-cell :title="game.introValue" size="large" :label="game.introLabel" @click="enterGame(game)"/>
          <template #right>
            <van-button square type="primary" text="编辑" @click="mgmtGame"/>
          </template>
        </van-swipe-cell>
      </template>
    </van-list>
  </div>
</template>

<style>

</style>
