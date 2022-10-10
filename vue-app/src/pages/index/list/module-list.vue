<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import ChessUtils from "@/pages/index/chess-utils.js";
import IndexAxiosUtils from "@/pages/index/index-axios-utils";
import {Toast} from 'vant';

let data = reactive({
  showFilterPanel: [],
  filter: {
    onlyHardFlag: false,
  },
  games: [],
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  loadGameList();
});

watch(data.filter, () => {
  loadGameList();
});

async function downloadData() {
  data.games = [];

  let dataList = await GameUtils.downloadGameData();
  if (!dataList) {
    Toast.fail({message: `未发现服务器数据`, position: 'bottom'});
    return;
  }

  let message = `发现服务器数据，共${_.size(dataList)}条记录。`;
  Toast({message: message, position: 'bottom'});

  loadGameList();
}

async function uploadData() {
  await GameUtils.uploadGameData();
  Toast({message: `推送现服务器数据成功`, position: 'bottom'});

  await downloadData();
}

async function loadData() {
  let dataList = await GameUtils.loadGameData();

  let message = `发现本地数据，共${_.size(dataList)}条记录。`;
  Toast({message: message, position: 'bottom'});

  loadGameList();
}

function loadGameList() {
  data.games = GameUtils.fetchAllGames(data.filter);
}

function enterGame(game) {
  router.push({name: 'game', query: {gameId: game.id}});
}

function mgmtGame(game) {
  router.push({name: 'mgmt', query: {gameId: game?.id}});
}

</script>

<template>
  <div class="module-mgmt">
    <van-nav-bar :fixed="true" :placeholder="true"
                 title="棋局列表"
                 right-text="新增棋局" right-arrow @click-right="mgmtGame(null)"
    />
    <van-collapse v-model="data.showFilterPanel" class="filter-panel">
      <van-collapse-item title="列表过滤面板" name="1" :border="false">
        <van-cell-group inset>
          <van-field label="仅展示难题" input-align="right">
            <template #input>
              <van-switch v-model="data.filter.onlyHardFlag"/>
            </template>
          </van-field>
        </van-cell-group>
      </van-collapse-item>
    </van-collapse>
    <van-list class="game-list">
      <template v-for="game in data.games">
        <van-swipe-cell>
          <van-cell center size="large"
                    :title="game.introValue" :label="game.introLabel"
                    @click="enterGame(game)">
            <template #icon>
              <van-icon :name="game.levelIcon" :color="game.levelIconColor" size="22px"/>
            </template>
            <template #right-icon>
              <van-icon v-if="game.hardFlag==true" name="star" color="black" size="22px"/>
            </template>
          </van-cell>
          <template #right>
            <van-button square type="primary" text="编辑" @click="mgmtGame(game)"/>
          </template>
        </van-swipe-cell>
      </template>
    </van-list>
    <van-action-bar :placeholder="true">
      <van-space>
        <van-button type="primary" plain hairline @click="downloadData();">从服务器下载</van-button>
        <van-button type="primary" plain hairline @click="uploadData();">上传至服务器</van-button>
        <van-button type="primary" plain hairline @click="loadData();">从本地加载</van-button>
      </van-space>
    </van-action-bar>
  </div>
</template>

<style lang="scss">

.filter-panel {
  border: 1px solid #F0F0F0;

  .van-collapse-item {
    > .van-cell {
      background-color: #F0F0F0;
    }
  }
}

.game-list {
  .van-cell {
    > .van-cell__title {
      padding-left: var(--van-cell-horizontal-padding);
    }
  }

  .van-swipe-cell__right {
    > .van-button {
      height: inherit;
    }
  }
}


</style>
