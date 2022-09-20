<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import GameMobile from "@/components/game-mobile.vue";

let data = reactive({
  selectedGame: null,
  hasNextGame: false,
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  await init();
});

async function init() {
  let gameId = route.query.gameId;
  data.selectedGame = GameUtils.getGameById(gameId);
  data.hasNextGame = GameUtils.fetchNextGame(data.selectedGame.id) != null;
}

function goBack() {
  router.back();
}


function nextGame(){
  let nextGame = GameUtils.fetchNextGame(data.selectedGame.id);
  if(nextGame==null){

  }else{
    data.selectedGame = nextGame;
    data.hasNextGame = GameUtils.fetchNextGame(data.selectedGame.id) != null;
  }
}
</script>

<template>
  <div class="module-game">
    <van-nav-bar :fixed="true" :placeholder="true"
                 left-text="返回" @click-left="goBack"
                 :title="data.selectedGame?.introValue"
                 :right-text="data.hasNextGame?'下一局':''" @click-right="nextGame"
    />
    <div v-if="data.selectedGame">
      <van-cell-group inset>
        <van-field label="描述" v-model="data.selectedGame.desc"/>
        <van-field label="标签">
          <template #input>
            <div>
              <van-tag v-for="tag in data.selectedGame.tags" size="large" plain type="primary">{{ tag }}</van-tag>
            </div>
          </template>
        </van-field>
      </van-cell-group>

      <template v-if="data.selectedGame">
        <GameMobile :game="data.selectedGame" :withBoard="true" style="width: 100%;"/>
      </template>
    </div>

  </div>
</template>

<style lang="scss">

.module-game {
  //background: #F0F0F0;
}
</style>
