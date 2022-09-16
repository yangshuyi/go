<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import Game from "@/components/game.vue";

let data = reactive({
  games: [],
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  await init();
});

async function init() {
  data.games = GameUtils.fetchAllGames();
}

function enterGame(game) {
  router.push({name: 'game', query: {gameId: game.id}});
}

function mgmtGame(game) {
  router.push({name: 'mgmt', query: {gameId: game?.id}});
}

</script>

<template>
  <div>
    <div>
      <div @click="mgmtGame(null)">新增</div>
    </div>
    <div class="list">
      <div>
        <div v-for="game in data.games" class="item cccis-flex-row" >
          <div @click="enterGame(game)">{{
              game.id + " " + game.title + " " + game.chessBoardSize + " " + game.desc + " [" + _.join(game.tags, ",") + "] " + game.level
            }}
          </div>
          <div @click="mgmtGame(game)">编辑</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
