<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import {CccisLoggerUtils} from "@cccis/vue3-common";
import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import Game from "@/components/game.vue";

let data = reactive({
  showFullTitle: false,
  selectedGame: null,
  hasNextGame: false,
  levelOptions: Constants.LEVEL_OPTIONS,
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  CccisLoggerUtils.debug("module-game onMounted");
  await init();
});

async function init() {
  let gameId = route.query.gameId;
  data.selectedGame = GameUtils.getGameById(gameId);
  data.hasNextGame = GameUtils.fetchNextGame(data.selectedGame.id) != null;
}

function toggleShowFullTitle() {
  data.showFullTitle = !data.showFullTitle;
}

function goBack() {
  router.back();
}


function nextGame() {
  let nextGame = GameUtils.fetchNextGame(data.selectedGame.id);
  if (nextGame == null) {

  } else {
    data.selectedGame = nextGame;
    data.hasNextGame = GameUtils.fetchNextGame(data.selectedGame.id) != null;
  }
}

function updateGameLevel(levelOption) {
  data.selectedGame.level = levelOption.value;
  data.selectedGame.levelIcon = levelOption.icon;
  data.selectedGame.levelIconColor = levelOption.iconColor;
}

function mgmtGame() {
  router.push({name: 'mgmt', query: {gameId: data.selectedGame.id}});
}

function toggleHardFlag(){
  data.selectedGame.hardFlag = !data.selectedGame.hardFlag;
}

</script>

<template>
  <div class="module-game">
    <van-nav-bar :fixed="true" :placeholder="true"
                 left-text="返回" @click-left="goBack"
                 :right-text="data.hasNextGame?'下一局':''" @click-right="nextGame"
    >
      <template #title>
        <div :class="{'van-ellipsis': !data.showFullTitle}" @click="toggleShowFullTitle">{{ data.selectedGame?.introValue }}</div>
      </template>
    </van-nav-bar>
    <template v-if="data.selectedGame">
      <div class="info-section">
        <div>
          <div class="info-row">
            <div class="info-label">描述</div>
            <div class="info-text">{{ data.selectedGame.desc }}</div>
          </div>
          <div class="info-row">
            <div class="info-label">标签</div>
            <div class="info-text">
              <van-tag v-for="tag in data.selectedGame.tags" size="large" plain type="primary">{{ tag }}</van-tag>
            </div>
          </div>
        </div>
        <van-icon :name="data.selectedGame.levelIcon" :color="data.selectedGame.levelIconColor" size="50px"/>
      </div>

      <div class="game-section">
        <Game :game="data.selectedGame" :withBoard="true" style="width: 100%;"/>
      </div>

      <van-action-bar>
        <van-row justify="space-around" style="width: 100%;">
          <template v-for="levelOption in data.levelOptions">
            <van-action-bar-icon :icon="levelOption.icon" :text="levelOption.text" :color="levelOption.iconColor" @click="updateGameLevel(levelOption)"/>
          </template>
          <van-action-bar-icon icon="star" text="难题" :color="data.selectedGame.hardFlag==true?'black':'lightgray'" @click="toggleHardFlag()"/>
          <van-action-bar-icon icon="edit" text="编辑" color="black" @click="mgmtGame"/>
        </van-row>
      </van-action-bar>
    </template>
  </div>
</template>

<style lang="scss">

.module-game {
  .van-nav-bar {
    .van-nav-bar__title {
      white-space: initial;
    }
  }

  .info-section {
    position: relative;
    background-color: #F0F0F0;
    //margin-top: var(--van-cell-vertical-padding);

    .info-row {
      color: var(--van-field-label-color);

      display: flex;
      align-items: center;
      padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);

      .info-label {
        width: 60px;
      }

      .info-text {
        display: flex;
        align-items: center;
      }
    }

    .van-icon {
      position: absolute;
      right: var(--van-cell-horizontal-padding);
      top: var(--van-cell-vertical-padding);
    }
  }

  .game-section {
    padding: 20px 0px;
  }

  .van-action-bar {
    background-color: #F0F0F0;

    .van-action-bar-icon {
      background-color: #F0F0F0;
    }
  }
}
</style>
