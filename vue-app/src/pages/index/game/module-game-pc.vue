<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import GameMobile from "@/components/game-mobile.vue";

let data = reactive({
  selectedGame: null,
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  await init();
});

async function init() {
  let gameId = route.query.gameId;
  data.selectedGame = GameUtils.getGameById(gameId);
}

async function goBack() {
  router.back();
}

</script>

<template>
  <div class="module-game">
    <div class="module-head">
      <CccisButton text="返回" class="left-btn" @click="goBack"/>
      <div class="title">{{ data.selectedGame.book+" - "+data.selectedGame.title }}</div>
    </div>
    <div>
      <div class="game-desc">
        <div>描述：</div>
        <div>{{ data.game?.desc }}</div>
      </div>
      <div class="game-tag-list">
        <div>标签：</div>
        <div v-for="tag in data.game?.tagList" class="game-tag">
          <div>{{ tag }}</div>
        </div>
      </div>
    </div>

    <template v-if="data.selectedGame">
      <GameMobile :game="data.selectedGame" style="width: 500px;"/>
    </template>
  </div>

</template>

<style>
.module-game{

}
</style>
