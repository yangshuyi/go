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

const props = defineProps();

const emits = defineEmits(['onChessStep'])

defineExpose({
  init, drawChess, clearChess
});

let domChessBoardRef = ref(null);
let domChessBoardCanvasRef = ref(null);

let data = reactive({
  chessBoardSize: 11, //'路'
  showMark: true,
  showBoard: true,
  canvas: {
    ctx: null,
    scale: 4,
    boardBorder: 0, //棋盘边长
    unitBorder: 0, //格子边长
    padding: 0, //棋盘边距
  },
});


onMounted(() => { // 需要获取到element,所以是onMounted的Hook

});

function init(chessBoardSize, showMark = false, showBoard = false) {
  let chessBoardBorder = domChessBoardRef.value?.clientWidth;
  console.log("init canvas: " + chessBoardBorder);
  if (!chessBoardBorder) {
    return;
  }

  data.chessBoardSize = chessBoardSize;
  data.showMark = showMark;
  data.showBoard = showBoard;

  let unit = Math.trunc(chessBoardBorder / (data.chessBoardSize + 1) * 2); //padding为unitBorder的1/2
  if (unit > 25) {
    unit = 25;
  }
  data.canvas.unitBorder = unit * 2;
  data.canvas.padding = unit * 2;
  console.log("data.canvas.padding:" + data.canvas.padding);
  data.canvas.boardBorder = data.canvas.padding * 2 + data.canvas.unitBorder * (data.chessBoardSize - 1);

  domChessBoardCanvasRef.value.width = data.canvas.boardBorder * data.canvas.scale;
  domChessBoardCanvasRef.value.height = data.canvas.boardBorder * data.canvas.scale;
  domChessBoardCanvasRef.value.style.width = data.canvas.boardBorder + 'px';
  domChessBoardCanvasRef.value.style.height = data.canvas.boardBorder + 'px';

  drawCanvas();
}

function drawCanvas() {
  let ctx = domChessBoardCanvasRef.value?.getContext("2d");
  if (!ctx) {
    return;
  }
  data.canvas.ctx = ctx;

  console.log(JSON.stringify(data));

  ctx.scale(data.canvas.scale, data.canvas.scale);

  drawPadding();
  drawLine(ctx);
}

function drawPadding() {
  let ctx = data.canvas.ctx;
  ctx.save();

  ctx.strokeStyle = "red";
  ctx.fillStyle = "yellow";

  ctx.restore();
}

function drawLine() {
  let ctx = data.canvas.ctx;
  ctx.save();

  ctx.strokeStyle = "black";
  ctx.fillStyle = "black";
  ctx.textAlign = 'center';
  ctx.textBaseline = "middle";
  ctx.font = 'normal bold 20px Arial'

  let labelArray = _.get(_.find(Constants.CHESS_BOARD_SIZE_OPTIONS, {value:data.chessBoardSize}), 'label');
  //竖线
  for (let colIdx = 0; colIdx < data.chessBoardSize; colIdx++) {
    ctx.fillText(labelArray[colIdx].column2, data.canvas.padding + data.canvas.unitBorder * colIdx, data.canvas.padding / 4);

    ctx.moveTo(data.canvas.padding + data.canvas.unitBorder * colIdx, data.canvas.padding);
    ctx.lineTo(data.canvas.padding + data.canvas.unitBorder * colIdx, data.canvas.boardBorder - data.canvas.padding);
    ctx.stroke();

  }
  //横线
  for (let rowIdx = 0; rowIdx < data.chessBoardSize; rowIdx++) {
    ctx.fillText(labelArray[rowIdx].row2, data.canvas.padding / 4, data.canvas.padding + data.canvas.unitBorder * rowIdx);

    ctx.moveTo(data.canvas.padding, data.canvas.padding + data.canvas.unitBorder * rowIdx);
    ctx.lineTo(data.canvas.boardBorder - data.canvas.padding, data.canvas.padding + data.canvas.unitBorder * rowIdx);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * chessObj:
 *  color: black,white
 *  fixed: true,false
 *  marked: true,false,
 *  markedColor: black, white
 *  pos:
 *    x:
 *    y:
 *
 *
 *
 */
function drawChess(chessObj) {
  //console.log("drawChess:" + JSON.stringify(chessObj));
  if (!chessObj) {
    return;
  }

  let ctx = data.canvas.ctx;
  ctx.save();

  let x = chessObj.pos.x * data.canvas.unitBorder + data.canvas.padding;
  let y = chessObj.pos.y * data.canvas.unitBorder + data.canvas.padding;

  ctx.translate(x, y);

  let chessRadius = data.canvas.unitBorder * 4 / 9;

  ctx.fillStyle = chessObj.color;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.arc(0, 0, chessRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
  ctx.stroke();

  if (data.showMark && chessObj.marked) {
    let border = chessRadius * 2 / 3;

    ctx.fillStyle = chessObj.markedColor;
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(0, -1 * border);
    ctx.lineTo(border * Math.cos(Math.PI / 6), border * Math.sin(Math.PI / 6));
    ctx.lineTo(-1 * border * Math.cos(Math.PI / 6), border * Math.sin(Math.PI / 6));
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }

  if (chessObj.caption) {

    ctx.fillStyle = chessObj.markedColor;

    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.font = 'normal bold 20px Arial'
    ctx.fillText(chessObj.caption, 0, 0);
  }

  ctx.restore();
}


function clearChess(chessObj) {
  console.log("clearChess:" + JSON.stringify(chessObj));
  if (!chessObj) {
    return;
  }

  let ctx = data.canvas.ctx;
  ctx.save();

  let x = chessObj.pos.x * data.canvas.unitBorder + data.canvas.padding;
  let y = chessObj.pos.y * data.canvas.unitBorder + data.canvas.padding;
  ctx.translate(x, y);

  ctx.strokeStyle = "black";

  ctx.clearRect(-data.canvas.unitBorder / 2, -data.canvas.unitBorder / 2, data.canvas.unitBorder, data.canvas.unitBorder);

  ctx.beginPath();
  if (chessObj.pos.x == 0) {
    ctx.moveTo(0, 0);
    ctx.lineTo(data.canvas.unitBorder / 2, 0);
  } else if (chessObj.pos.x == (data.chessBoardSize - 1)) {
    ctx.moveTo(-data.canvas.unitBorder / 2, 0);
    ctx.lineTo(0, 0);
  } else {
    ctx.moveTo(-data.canvas.unitBorder / 2, 0);
    ctx.lineTo(data.canvas.unitBorder / 2, 0);
  }
  ctx.stroke();

  ctx.beginPath();
  if (chessObj.pos.y == 0) {
    ctx.moveTo(0, 0);
    ctx.lineTo(0, data.canvas.unitBorder / 2);
  } else if (chessObj.pos.y == (data.chessBoardSize - 1)) {
    ctx.moveTo(0, -data.canvas.unitBorder / 2);
    ctx.lineTo(0, 0);
  } else {
    ctx.moveTo(0, -data.canvas.unitBorder / 2);
    ctx.lineTo(0, data.canvas.unitBorder / 2);
  }
  ctx.stroke();

  ctx.restore();
}

function onCanvasClick($target) {
  let posX = Math.round((($target.offsetX - data.canvas.padding)) / data.canvas.unitBorder);
  let posY = Math.round((($target.offsetY - data.canvas.padding)) / data.canvas.unitBorder);

  emits("onChessStep", {pos: {x: posX, y: posY}});
}


</script>

<template>
  <div class="chess-board" :class="{'with-board': data.showBoard==true}">
    <div ref="domChessBoardRef" class="wrap">
      <canvas ref="domChessBoardCanvasRef" @click="onCanvasClick"></canvas>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chess-board {
  > .wrap {
    //background-image: url(/chess-board-bg.png);
    display: flex;
    align-items: center;
    justify-content: center;

    > .chess-board-canvas {
      width: 100%;
      height: 100%;
    }
  }
}

.chess-board.with-board {
  > .wrap {
    background-image: url(/chess-board-bg.png);
  }
}
</style>
