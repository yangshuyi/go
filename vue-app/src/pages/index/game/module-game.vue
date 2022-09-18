<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import Game from "@/components/game.vue";

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
  <div class="">
    <div class="cccis-flex-row">
      <div @click="goBack" class="go-back-btn">返回</div>
    </div>
    <template v-if="data.selectedGame">
      <Game :game="data.selectedGame" style="width: 500px;"/>
    </template>
  </div>

</template>

<style scoped>
.go-back-btn {
  width: fit-content;
  background: gray;
  padding: 10px;
}
</style>
