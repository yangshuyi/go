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
} from 'vue';

import _ from 'lodash';
import Constants from "@/components/constants";
import stylusPluginManager from "@/cordova-plugins/stylus/stylus-plugin-manager";
import ChessBoard from "@/components/chess-board.vue";

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
  data.game.stepList = [];
  data.game.currChessList = [];
  data.game.currNextStep = data.game.nextChessType;

  domChessBoardRef.value?.init(data.game.chessBoardSize, data.showMark, data.showBoard);

  _.each(data.game.chessList, (chessItem) => {
    let chess = JSON.parse(JSON.stringify(chessItem));

    data.game.currChessList.push(chess);

    domChessBoardRef.value?.drawChess(chess);
  });
}

function stepForward(action, chess) {
  if (action == 'add') {
    data.game.currChessList.push(chess);
    domChessBoardRef.value?.drawChess(chess);
  } else if (action == 'remove') {
    removeChessInBoardByPosition(chess.pos);
    domChessBoardRef.value?.clearChess(chess);
  }

  data.game.stepList.push({
    action: action,
    chess: chess
  });
}

function stepBackward() {
  let lastStep = data.game.stepList.pop();
  if (!lastStep) {
    return;
  }

  if (lastStep.action == 'add') {
    removeChessInBoardByPosition(lastStep.chess.pos);
    domChessBoardRef.value?.clearChess(lastStep.chess);
  } else if (lastStep.action == 'remove') {
    data.game.currChessList.push(lastStep.chess);
    domChessBoardRef.value?.drawChess(lastStep.chess);
  }
}

function markLevel(level) {
  data.game.level = level;
}

function onChessStep($chess) {
  if (!data.game) {
    return;
  }

  let chess = getChessInBoardByPosition($chess.pos);

  if (data.game.currNextStep == Constants.CHESS_TYPE.CLEAR.value) {
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
      let caption = (_.max(_.map(data.game.currChessList, 'caption')) || 0) + 1;

      let chessType = Constants.CHESS_TYPE[data.game.currNextStep];
      let newChess = {
        color: chessType.color,
        fixed: false,
        caption: caption,
        marked: false,
        markedColor: chessType.markedColor,
        pos: {x: $chess.pos.x, y: $chess.pos.y}
      };
      stepForward('add', newChess);

      //调整下一步
      data.game.currNextStep = chessType.nextStep;
      return;
    }
  }
}

function getChessInBoardByPosition(pos) {
  let result = _.find(data.game.currChessList, (item) => {
    return item.pos.x == pos.x && item.pos.y == pos.y;
  });
  return result;
}

function removeChessInBoardByPosition(pos) {
  let result = _.remove(data.game.currChessList, (item) => {
    return item.pos.x == pos.x && item.pos.y == pos.y;
  });
  return result;
}


</script>

<template>
  <div class="game">
    <div v-if="data.game" class="block">

      <van-cell-group inset>
        <van-field label="当前手">
          <template #input>
            <van-radio-group v-model="data.game.currNextStep" direction="horizontal" @change="">
              <van-radio name="BLACK">黑棋</van-radio>
              <van-radio name="WHITE">白棋</van-radio>
              <van-radio name="CLEAR">清除</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field label="展示标记">
          <template #input>
            <van-switch v-model="data.showMark" @change="reset"/>
          </template>
        </van-field>
        <van-field label="展示棋盘">
          <template #input>
            <van-switch v-model="data.showBoard" @change="reset"/>
          </template>
        </van-field>
      </van-cell-group>
    </div>

    <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep" style="width:100%;"></ChessBoard>

    <!--    <div class="debug-info">-->
    <!--      <div v-for="chess in data.game?.currChessList" class="row">-->
    <!--        <div>{{ JSON.stringify(chess) }}</div>-->
    <!--      </div>-->
    <!--    </div>-->

    <van-row justify="space-around">
      <van-col span="6">
        <van-button type="primary" plain hairline  @click="reset();" :disabled="data.game?.stepList.length==0">还原</van-button>
      </van-col>
      <van-col span="6">
        <van-button type="primary" plain hairline  @click="stepBackward()" :disabled="data.game?.stepList.length==0">上一步</van-button>
      </van-col>
    </van-row>

    <van-space>
    </van-space>

  </div>

</template>

<style lang="scss">
.game {

    > .chess-board {
      padding: 5px;
      align-self: center;
    }

    > .debug-info {
      font-size: 12px;
    }
  }
</style>
