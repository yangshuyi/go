<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import IndexAxiosUtils from "@/pages/index/index-axios-utils";
import {Toast} from 'vant';

let data = reactive({
  games: [],
});

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  data.games = GameUtils.fetchAllGames();
});

async function downloadData() {
  data.games = [];
  let remoteObj = await IndexAxiosUtils.downloadGameData();
  if (remoteObj && remoteObj.valueObj) {
    let message = `发现服务器数据，共${_.size(remoteObj.valueObj)}条记录。\n版本时间：${remoteObj.timestamp}`;
    Toast({message: message, position: 'bottom'});

    GameUtils.init(remoteObj.valueObj);
    data.games = GameUtils.fetchAllGames();
  } else {
    Toast.fail({message: `未发现服务器数据`, position: 'bottom'});
  }
}

async function uploadData() {
  await IndexAxiosUtils.uploadGameData(data.games);
  Toast({message: `推送现服务器数据成功`, position: 'bottom'});

  await downloadData();
}

async function loadData() {
  let gameList = await IndexAxiosUtils.loadGameData();
  let message = `发现本地数据，共${_.size(gameList)}条记录。`;
  Toast({message: message, position: 'bottom'});

  GameUtils.init(gameList);
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
  <div class="module-mgmt">
    <van-nav-bar :fixed="true" :placeholder="true"
                 title="棋局列表"
                 right-text="新增棋局" right-arrow @click-right="mgmtGame(null)"
    />
    <van-list>
      <template v-for="game in data.games">
        <van-swipe-cell>
          <van-cell center size="large"
                    :title="game.introValue" :label="game.introLabel"
                    @click="enterGame(game)">
            <template #icon>
              <van-icon :name="game.levelIcon" :color="game.levelIconColor" size="22px"/>
            </template>
          </van-cell>
          <template #right>
            <van-button square type="primary" text="编辑" @click="mgmtGame"/>
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

.van-cell {
  > .van-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: var(--van-cell-horizontal-padding);
  }
}

.van-swipe-cell__right {

  > .van-button {
    height: inherit;
  }
}
</style>
