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
    book: '',
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
    bookOptions: Constants.BOOK_LIST,
    chessBoardSizeOptions: Constants.CHESS_BOARD_SIZE_OPTIONS,
    levelOptions: Constants.LEVEL_OPTIONS,
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
    data.field.book = game.book;
    data.field.title = game.title;
    data.field.chessBoardSize = game.chessBoardSize;
    data.field.desc = game.desc;
    data.field.tags = _.join(game.tags, ",");
    data.field.level = game.level;
    data.field.nextChessType = game.nextChessType;
    data.field.chessList = game.chessList;
  } else {
    data.isNewGame = true;
    data.field.id = new Date().getTime() + "";
  }

  domChessBoardRef.value?.init(data.field.chessBoardSize);
  _.each(data.field.chessList, (item) => {
    domChessBoardRef.value?.drawChess(item);
  });
}

async function goBack() {
  router.back();
}

async function save() {
  let gameId = route.query.gameId;
  let game = null;
  if (gameId) {
    let game = GameUtils.getGameById(gameId);

  } else {
    game = {};
    game.id = data.field.id;
    let result = GameUtils.addGame(game);
    if (!result) {
      await CccisDialogUtils.alert("该ID已存在");
      return;
    }
  }

  game.title = data.field.title;
  game.chessBoardSize = data.field.chessBoardSize;
  game.desc = data.field.desc;
  game.tags = _.split(data.field.tags, ",");
  game.level = data.field.level;
  game.nextChessType = data.field.nextChessType;
  game.chessList = data.field.chessList;

  console.log(JSON.stringify(game));
}

function afterChessBoardSizeChanged() {
  domChessBoardRef.value?.init(data.field.chessBoardSize);
  _.each(data.field.chessList, (item) => {
    domChessBoardRef.value?.drawChess(item);
  });
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
  <div class="module-mgmt">
    <div class="module-head">
      <CccisButton text="返回" class="left-btn" @click="goBack"/>
      <div class="title">{{ data.isNewGame ? '新增棋局' : '编辑棋局' }}</div>
      <CccisButton text="保存" class="right-btn" @click="save"/>
    </div>
    <div class="game-info">
      <div class="cccis-flex-row cccis-row">
        <CccisLabelField caption="ID" style="width: 300px;">
          <CccisTextField v-model:value="data.field.id" :disabled="true"/>
        </CccisLabelField>
        <CccisLabelField caption="书籍" style="width: 300px;">
          <CccisSelectorSimpleField v-model:value="data.field.book" :optionList="data.optionList.bookOptions"/>
        </CccisLabelField>
        <CccisLabelField caption="标题" style="width: 300px;">
          <CccisTextField v-model:value="data.field.title"/>
        </CccisLabelField>
      </div>
      <div class="cccis-flex-row cccis-row">
        <CccisLabelField caption="描述" style="width: 300px;">
          <CccisTextField v-model:value="data.field.desc"/>
        </CccisLabelField>
        <CccisLabelField caption="标签" style="width: 300px;">
          <CccisTextField v-model:value="data.field.tags"/>
        </CccisLabelField>
      </div>
      <div class="cccis-flex-row cccis-row">
        <CccisLabelField caption="棋盘" style="width: 300px;">
          <CccisSelectorSimpleField v-model:value="data.field.chessBoardSize" :optionList="data.optionList.chessBoardSizeOptions"
                                    @afterOptionSelected="afterChessBoardSizeChanged()"/>
        </CccisLabelField>
        <CccisLabelField caption="级别" style="width: 300px;">
          <CccisSelectorSimpleField v-model:value="data.field.level" :optionList="data.optionList.levelOptions"/>
        </CccisLabelField>
        <CccisLabelField caption="先手" style="width: 300px;">
          <CccisSelectorSimpleField v-model:value="data.field.nextChessType" :optionList="data.optionList.nextChessTypeOptions"/>
        </CccisLabelField>
      </div>
      <div class="cccis-flex-row cccis-row">
        <CccisLabelField caption="操作" style="width: 300px;">
          <div></div>
          <CccisToggleSingleButton v-model:value="data.chessType" :optionList="data.optionList.nextChessTypeOptions"/>
        </CccisLabelField>
        <CccisLabelField caption="" style="width: 300px;">
          <CccisCheckboxField v-model:value="data.marked" caption="标记" valueType="0"/>
        </CccisLabelField>
      </div>
    </div>
    <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep"/>
  </div>

</template>

<style lang="scss">
.module-mgmt {
  display: flex;
  flex-direction: column;

  > .game-info {

  }

  > .chess-board {
    padding: 20px;
    align-self: center;
  }
}
</style>
