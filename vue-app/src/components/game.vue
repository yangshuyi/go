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
});

watch(() => props.game, (newVal, oldVal) => {
  init();
});


onMounted(() => { // 需要获取到element,所以是onMounted的Hook
  init();
});

function init() {
  data.game = props.game;

  reset();
}

function reset() {
  data.game.stepList = [];
  data.game.currChessList = [];
  data.game.currNextStep = data.game.nextChessType;

  domChessBoardRef.value?.init(data.game.chessBoardSize);

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

function updateNextChessStep(chessType) {
  data.game.currNextStep = chessType;
}

function onChessStep($chess) {
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
    <div class="game-info">
      <div class="game-title">
        <div>标题：</div>
        <div>{{ data.game?.title }}</div>
      </div>
      <div class="game-desc">
        <div>描述：</div>
        <div>{{ data.game?.desc }}</div>
      </div>
      <div class="game-tag-list">
        <div>标签：</div>
        <div v-for="tag in data.game?.tagList" class="game-tag">
          <div>{{ tag }}</div>
        </div>
      </div>
      <div class="game-action-list">
        <div>操作：</div>
        <div v-if="data.game?.stepList.length>0" class="game-action" @click="reset();">
          <div>还原</div>
        </div>
        <div v-if="data.game?.stepList.length>0" class="game-action" @click="stepBackward()">
          <div>上一步</div>
        </div>
        <div class="game-action" :class="{'selected': data.game?.currNextStep=='WHITE' }"
             @click="updateNextChessStep('WHITE')">
          <div>白棋</div>
        </div>
        <div class="game-action" :class="{'selected': data.game?.currNextStep=='BLACK' }"
             @click="updateNextChessStep('BLACK')">
          <div>黑棋</div>
        </div>
        <div class="game-action" :class="{'selected': data.game?.currNextStep=='CLEAR' }"
             @click="updateNextChessStep('CLEAR')">
          <div>清除</div>
        </div>
        <div class="game-action" :class="{'selected': data.game?.level==0 }" @click="markLevel(0)">
          <div>标记0</div>
        </div>
        <div class="game-action" :class="{'selected': data.game?.level==1 }" @click="markLevel(1)">
          <div>标记1</div>
        </div>
      </div>
    </div>
    <ChessBoard ref="domChessBoardRef" @onChessStep="onChessStep"></ChessBoard>
    <div class="debug-info">
      <div v-for="chess in data.game?.currChessList" class="row">
        <div>{{ JSON.stringify(chess) }}</div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.game {
  display: flex;
  flex-direction: column;

  > .game-info {
    .game-title, .game-desc {
      display: flex;
      align-items: center;
      justify-content: start;
      height: 30px;
    }

    .game-tag-list {
      display: flex;
      align-items: center;
      justify-content: start;
      height: 30px;

      > .game-tag {
        border: 1px solid darkgray;
        margin-right: 20px;
        padding: 0px 10px;
      }
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

  > .debug-info {
    font-size: 12px;
  }
}
</style>
