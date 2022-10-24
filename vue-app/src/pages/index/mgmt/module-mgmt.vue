<script setup>

import {computed, inject, Text, ref, reactive, useSlots, watch, onMounted} from 'vue'
import _ from 'lodash';
import {useRoute, useRouter} from "vue-router";
import {CccisExplorerUtils} from "@cccis/vue3-common";

import Constants from "@/components/constants";
import GameUtils from "@/pages/index/game-utils.js";
import ChessUtils from "@/pages/index/chess-utils.js";
import ChessBoard from "@/components/chess-board.vue";
import DropdownField from "@/components/dropdown-field/dropdown-field.vue";
import {Dialog} from 'vant';

let data = reactive({
  isNewGame: true,
  field: {
    id: '',
    book: '',
    title: '',
    chessBoardSize: 11,
    desc: '',
    tags: '',
    level: 1,
    nextChessType: 'B',
    chessBoard: {},
  },
  marked: false,
  chessType: 'B',
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
    data.field.tagsText = game.tagsText;
    data.field.level = game.level;
    data.field.nextChessType = game.nextChessType;
    data.field.chessBoard = game.chessBoard;
  } else {
    data.isNewGame = true;
    data.field.id = new Date().getTime() + "";

    let gameTmpl = GameUtils.getGameTemplate();
    if (gameTmpl) {
      data.field.book = gameTmpl.book;
      data.field.title = GameUtils.generateNewGameTitle(gameTmpl.title);
      data.field.chessBoardSize = gameTmpl.chessBoardSize;
      data.field.desc = gameTmpl.desc;
      data.field.tagsText = gameTmpl.tagsText;
      data.field.level = gameTmpl.level;
      data.field.nextChessType = gameTmpl.nextChessType;
    }
  }

  domChessBoardRef.value?.init(data.field.chessBoardSize, true, false);
  _.each(data.field.chessBoard, (item) => {
    domChessBoardRef.value?.drawChess(item);
  });
}

function goBack() {
  router.back();
}

async function save() {
  let game = null;
  if (data.isNewGame == true) {
    GameUtils.saveGameTemplate(data.field);

    game = {};
    game.id = data.field.id;
    let result = GameUtils.addGame(game);
    if (!result) {
      let message = "该ID已存在"
      if (CccisExplorerUtils.isMobileDevice()) {
        await Dialog.alert({message: message});
      } else {
        await CccisDialogUtils.alert(message);
      }
      return;
    }
  } else {
    game = GameUtils.getGameById(data.field.id);
  }
  game.book = data.field.book;
  game.title = data.field.title;
  game.chessBoardSize = data.field.chessBoardSize;
  game.desc = data.field.desc;
  if (!data.field.tagsText) {
    game.tags = [];
  } else {
    game.tags = _.split(data.field.tagsText, ",");
  }
  game.level = data.field.level;
  game.nextChessType = data.field.nextChessType;
  game.chessBoard = data.field.chessBoard;

  GameUtils.buildGame(game);

  if (data.isNewGame == true) {

  }

  console.log(JSON.stringify(game));

  goBack();
}

function afterChessBoardSizeChanged() {
  domChessBoardRef.value?.init(data.field.chessBoardSize, true, false);
  _.each(data.field.chessBoard, (item) => {
    domChessBoardRef.value?.drawChess(item);
  });
}

function afterChessTypeChanged(){
  if(data.marked){
    data.marked = false;
  }
}

/**
 * $chess 仅有geo信息
 */
function onChessStep($chess) {
  let geo = $chess.geo;

  let chess = data.field.chessBoard[geo];

  if (data.chessType == Constants.CHESS_TYPE.C.value) {
    //删除棋子
    if (chess) {
      //棋盘上有棋子
      delete data.field.chessBoard[chess.geo];
      domChessBoardRef.value?.clearChess(chess);
    } else {
      //棋盘上没有棋子
    }
    return;
  } else {
    if (chess) {
      //棋盘上有棋子，检查是不是仅进行标记
      if(chess.type == data.chessType){
        if(chess.marked != data.marked){
          //仅对当前棋子进行标记
          chess.marked = data.marked;
          domChessBoardRef.value?.drawChess(chess);
        }
      }
    } else {
      //棋盘上没有棋子

      //创建棋子
      let chessType = Constants.CHESS_TYPE[data.chessType];
      let chess = {
        type: chessType.value,
        caption: '',
        marked: data.marked,
        geo: geo
      };
      data.field.chessBoard[chess.geo] = chess;
      domChessBoardRef.value?.drawChess(chess);
      return;
    }
  }
}

</script>

<template>
  <template v-if="true || CccisExplorerUtils.isMobileDevice()">
    <div class="module-mgmt module-mgmt-mobile">
      <van-nav-bar :fixed="true" :placeholder="true"
                   left-text="返回" @click-left="goBack"
                   :title="data.isNewGame ? '新增棋局' : '编辑棋局'"
                   right-text="保存" right-arrow @click-right="save"
      />

      <van-cell-group inset>
        <van-field label="书籍">
          <template #input>
            <DropdownField v-model:value="data.field.book" :optionList="data.optionList.bookOptions"/>
          </template>
        </van-field>

        <van-field label="标题" v-model="data.field.title" clearable/>

        <van-field label="描述" v-model="data.field.desc" clearable/>

        <van-field label="标签" v-model="data.field.tagsText" clearable/>

        <van-field label="棋盘">
          <template #input>
            <DropdownField v-model:value="data.field.chessBoardSize" :optionList="data.optionList.chessBoardSizeOptions"/>
          </template>
        </van-field>

        <van-field label="级别">
          <template #input>
            <DropdownField v-model:value="data.field.level" :optionList="data.optionList.levelOptions"/>
          </template>
        </van-field>


        <van-field label="先手">
          <template #input>
            <DropdownField v-model:value="data.field.nextChessType" :optionList="data.optionList.nextChessTypeOptions"/>
          </template>
        </van-field>

        <van-field label="操作" input-align="right">
          <template #input>
            <div>
              <CccisToggleSingleButton v-model:value="data.chessType" :optionList="data.optionList.nextChessTypeOptions"
                                       @afterOptionSelected="afterChessTypeChanged()"/>
            </div>
          </template>
        </van-field>

        <van-field label="标记" input-align="right">
          <template #input>
            <van-switch v-model="data.marked"/>
          </template>
        </van-field>
      </van-cell-group>

      <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep"/>
    </div>
  </template>
  <template v-else>
    <div class="module-mgmt module-mgmt-pc">
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
            <CccisToggleSingleButton v-model:value="data.chessType" :optionList="data.optionList.nextChessTypeOptions" @afterOptionSelected="afterChessTypeChanged()"/>
          </CccisLabelField>
          <CccisLabelField caption="" style="width: 300px;">
            <CccisCheckboxField v-model:value="data.marked" caption="标记" valueType="1"/>
          </CccisLabelField>
        </div>
      </div>
      <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep"/>
    </div>
  </template>
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
