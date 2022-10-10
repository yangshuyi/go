<script setup>
import {
  computed,
  inject,
  Text,
  ref,
  reactive,
  useSlots,
  watch,
  nextTick,
  defineExpose,
  onMounted,
  onUnmounted
} from 'vue'

import _ from 'lodash';
import Constants from "@/components/constants";
import stylusPluginManager from "@/cordova-plugins/stylus/stylus-plugin-manager";
import ChessBoard from "@/components/chess-board.vue";

import ChessUtils from "@/pages/index/chess-utils.js";

const props = defineProps({
  game: {
    desc: '棋局',
    type: Object
  },
});

let domChessBoardRef = ref(null);

let data = reactive({
  game: null,
  showMark: false,
  showBoard: false,
});

watch(() => props.game, (newVal, oldVal) => {
  init();
});


onMounted(() => { // 需要获取到element,所以是onMounted的Hook
  stylusPluginManager.init();
  setTimeout(() => {
    init();
  });
});

function init() {
  data.game = props.game;
  data.showMark = false;
  data.showBoard = false;

  reset();
}

function reset() {
  data.game.$stepList = []; //每一手
  data.game.$currChessBoard = {}; //当前棋盘上的棋子信息
  data.game.$currNextStep = data.game.nextChessType; //下一手

  domChessBoardRef.value?.init(data.game.chessBoardSize, data.showMark, data.showBoard);

  data.game.$currChessBoard = JSON.parse(JSON.stringify(data.game.chessBoard));

  _.each(data.game.$currChessBoard, (chess) => {
    domChessBoardRef.value?.drawChess(chess);
  });
}

function stepForward(action, chess) {
  if (action == 'add') {
    data.game.$currChessBoard[chess.geo] = chess;
    domChessBoardRef.value?.drawChess(chess);
  } else if (action == 'remove') {
    delete data.game.$currChessBoard[chess.geo];
    domChessBoardRef.value?.clearChess(chess);
  }

  data.game.$stepList.push({
    action: action,
    chess: chess
  });
}

function stepBackward() {
  let lastStep = data.game.$stepList.pop();
  if (!lastStep) {
    return;
  }

  if (lastStep.action == 'add') {
    delete data.game.$currChessBoard[lastStep.chess.geo];
    domChessBoardRef.value?.clearChess(lastStep.chess);
  } else if (lastStep.action == 'remove') {
    data.game.$currChessBoard[lastStep.chess.geo] = lastStep.chess;
    domChessBoardRef.value?.drawChess(lastStep.chess);
  }
}

function markLevel(level) {
  data.game.level = level;
}

/**
 * $chess 仅有geo信息
 */
function onChessStep($chess) {
  if (!data.game) {
    return;
  }

  let geo = $chess.geo;

  let chess = data.game.$currChessBoard[geo];

  if (data.game.$currNextStep == Constants.CHESS_TYPE.CLEAR.value) {
    //删除棋子
    if (chess) {
      //棋盘上有棋子
      stepForward('remove', chess);
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
      let caption = (_.max(_.map(data.game.$currChessBoard, 'caption')) || 0) + 1;

      let chessType = Constants.CHESS_TYPE[data.game.$currNextStep];
      let newChess = {
        color: chessType.color,
        caption: caption,
        marked: false,
        markedColor: chessType.markedColor,
        geo: geo
      };
      stepForward('add', newChess);

      //调整下一步
      data.game.$currNextStep = chessType.nextStep;
      return;
    }
  }
}


</script>

<template>
  <div class="game">
    <van-cell-group inset v-if="data.game" class="control-section">
      <van-field label="当前手" center>
        <template #input>
          <van-radio-group v-model="data.game.$currNextStep" direction="horizontal" @change="">
            <van-radio name="BLACK">黑棋</van-radio>
            <van-radio name="WHITE">白棋</van-radio>
            <van-radio name="CLEAR">清除</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field label="展示标记" center>
        <template #input>
          <van-switch v-model="data.showMark" @change="reset"/>
        </template>
      </van-field>
      <van-field label="展示棋盘" center>
        <template #input>
          <van-switch v-model="data.showBoard" @change="reset"/>
        </template>
      </van-field>
    </van-cell-group>

    <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep" style="width:100%;"></ChessBoard>

    <van-row justify="space-around" class="action-section">
      <van-col span="6">
        <van-button type="primary" plain hairline @click="reset();" :disabled="data.game?.$stepList.length==0">还原</van-button>
      </van-col>
      <van-col span="6">
        <van-button type="primary" plain hairline @click="stepBackward()" :disabled="data.game?.$stepList.length==0">上一步</van-button>
      </van-col>
    </van-row>

    <!--    <div class="debug-info-section">-->
    <!--      <div v-for="chess in data.game?.currChessBoard" class="row">-->
    <!--        <div>{{ chess.geo }}</div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>

</template>

<style lang="scss">
.game {
  > .control-section {
    .van-cell {
      height: 52px;
    }
  }

  > .chess-board {
    align-self: center;
  }

  > .action-section {
    margin-top: var(--van-cell-vertical-padding);

    .van-button {
      width: 100px;
    }
  }

  > .debug-info {
    font-size: 12px;
  }
}
</style>
