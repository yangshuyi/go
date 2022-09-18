<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import ChessBoard from "@/components/chess-board.vue";

let data = reactive({
  isNewGame: true,
  field: {
    id: '',
    title: '',
    chessBoardSize: 9,
    desc: '',
    tags: '',
    level: 1,
    nextChessType: 'BLACK',
    chessList: [],
  },
  marked: false,
  chessType: 'BLACK',
  optionList: {
    nextChessTypeOptions: Constants.CHESS_TYPE,
    chessBoardSizeOptions: [{text: '9', value: 9}, {text: '11', value: 11}, {text: '13', value: 13}, {
      text: '17',
      value: 17
    }, {text: '19', value: 19}],
    levelOptions: [{text: '0', value: 0}, {text: '1', value: 1}, {text: '2', value: 2}, {text: '3', value: 3}],
  }
});

let domChessBoardRef = ref(null);

let router = useRouter();
let route = useRoute();

onMounted(async () => {
  await init();
});

async function init() {
  let gameId = route.query.gameId;
  if (gameId) {
    data.isNewGame = false;
    let game = GameUtils.getGameById(gameId);
    data.field.id = game.id;
    data.field.title = game.title;
    data.field.chessBoardSize = game.chessBoardSize;
    data.field.desc = game.desc;
    data.field.tags = _.join(game.tags, ",");
    data.field.level = game.level;
    data.field.nextChessType = game.nextChessType;
    data.field.chessList = game.chessList;
  } else {
    data.isNewGame = true;
    data.field.id = new Date().getTime()+"";
  }

  domChessBoardRef.value?.init(data.game.chessBoardSize);
  _.each(data.field.chessList, (item)=>{
    domChessBoardRef.value?.drawChess(item);
  });
}

async function goBack() {
  router.back();
}

async function save(){
  let gameId = route.query.gameId;
  let game = null;
  if (gameId) {
    let game = GameUtils.getGameById(gameId);

  } else {
    game= {};
    game.id = data.field.id;
    let result = GameUtils.addGame(game);
    if(!result){
      await CccisDialogUtils.alert("该ID已存在");
      return;
    }
  }

  game.title = data.field.title;
  game.chessBoardSize = data.field.chessBoardSize;
  game.desc = data.field.desc;
  game.tags = _.split(data.field.tags, ",");
  game.level = data.field.level;
  game.nextChessType= data.field.nextChessType ;
  game.chessList = data.field.chessList;

  console.log(JSON.stringify(game));
}

function afterChessBoardSizeChanged(){
  domChessBoardRef.value?.init(data.game.chessBoardSize);
  _.each(data.field.chessList, (item)=>{
    domChessBoardRef.value?.drawChess(item);
  });
}

function toggleMarked() {
  data.marked = !data.marked;
}

function toggleChessType(chessType) {
  data.chessType = chessType;
}

function onChessStep($chess) {
  let chess = getChessInBoardByPosition($chess.pos);

  if (data.chessType == Constants.CHESS_TYPE.CLEAR.value) {
    //删除棋子
    if (chess) {
      //棋盘上有棋子
      removeChessInBoardByPosition(chess.pos);
      domChessBoardRef.value?.clearChess(chess);
    } else {
      //棋盘上没有棋子
    }
    return;
  } else {
    if (chess) {
      //棋盘上有棋子
    } else {
      //棋盘上没有棋子

      //创建棋子
      let chessType = Constants.CHESS_TYPE[data.chessType];
      let chess = {
        color: chessType.color,
        fixed: false,
        caption: '',
        marked: data.marked,
        markedColor: chessType.markedColor,
        pos: {x: $chess.pos.x, y: $chess.pos.y}
      };
      data.field.chessList.push(chess);
      domChessBoardRef.value?.drawChess(chess);
      return;
    }
  }
}

function getChessInBoardByPosition(pos) {
  let result = _.find(data.field.chessList, (item) => {
    return item.pos.x == pos.x && item.pos.y == pos.y;
  });
  return result;
}

function removeChessInBoardByPosition(pos) {
  let result = _.remove(data.field.chessList, (item) => {
    return item.pos.x == pos.x && item.pos.y == pos.y;
  });
  return result;
}

</script>

<template>
  <div class="mgmt">
    <div class="cccis-flex-row">
      <div @click="goBack" class="go-back-btn">返回</div>
      <div @click="save" class="go-back-btn">保存</div>
    </div>
    <div class="game-info">
      <CccisLabelField caption="ID" style="width: 200px;">
        <CccisTextField v-model:value="data.field.id" :disabled="true"/>
      </CccisLabelField>
      <CccisLabelField caption="标题" style="width: 200px;">
        <CccisTextField v-model:value="data.field.title"/>
      </CccisLabelField>
      <CccisLabelField caption="棋盘大小" style="width: 200px;">
        <CccisSelectorSimpleField v-model:value="data.field.chessBoardSize"
                                  :optionList="data.optionList.chessBoardSizeOptions" @afterOptionSelected="afterChessBoardSizeChanged()"/>
      </CccisLabelField>
      <CccisLabelField caption="描述" style="width: 200px;">
        <CccisTextField v-model:value="data.field.desc"/>
      </CccisLabelField>
      <CccisLabelField caption="标签" style="width: 200px;">
        <CccisTextField v-model:value="data.field.tags"/>
      </CccisLabelField>
      <CccisLabelField caption="级别" style="width: 200px;">
        <CccisSelectorSimpleField v-model:value="data.field.level" :optionList="data.optionList.levelOptions"/>
      </CccisLabelField>
      <CccisLabelField caption="先手" style="width: 200px;">
        <CccisSelectorSimpleField v-model:value="data.field.nextChessType"
                                  :optionList="data.optionList.nextChessTypeOptions"/>
      </CccisLabelField>

      <div class="game-action-list">
        <div>操作：</div>
        <div class="game-action" :class="{'selected': data.chessType=='WHITE' }"
             @click="toggleChessType('WHITE')">
          <div>白棋</div>
        </div>
        <div class="game-action" :class="{'selected': data.chessType=='BLACK' }"
             @click="toggleChessType('BLACK')">
          <div>黑棋</div>
        </div>
        <div class="game-action" :class="{'selected': data.chessType=='CLEAR' }"
             @click="toggleChessType('CLEAR')">
          <div>清除</div>
        </div>
        <div class="game-action" :class="{'selected': data.marked==true}"
             @click="toggleMarked()">
          <div>标记</div>
        </div>
      </div>
    </div>
    <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep"/>
  </div>

</template>

<style lang="scss">
.mgmt {
  display: flex;
  flex-direction: column;

  > .game-info {
    .cccis-label-field {
      margin-top: 10px;
    }

    .game-action-list {
      display: flex;
      align-items: center;
      justify-content: start;
      height: 30px;

      > .game-action {
        border: 1px solid darkgray;
        margin-right: 10px;
        padding: 0px 10px;

        &.selected {
          background: black;
          color: white;
        }
      }

    }
  }

  > .chess-board {
    padding: 20px;
    align-self: center;
  }
}
</style>
