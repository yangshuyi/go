import _ from 'lodash';

/**
 * 常量类
 */
export default {
    CHESS_TYPE: {
        BLACK: {text: '黑棋', value: 'BLACK', color: 'black', markedColor: 'white', nextStep: 'WHITE'},
        WHITE: {text: '白棋', value: 'WHITE', color: 'white', markedColor: 'black', nextStep: 'BLACK'},
        CLEAR: {text: '空', value: 'CLEAR', color: 'transparent', markedColor: 'transparent'},
    },
    CHESS_BOARD_SIZE_OPTIONS: [
        {text: '9路', value: 9},
        {text: '11路', value: 11},
        {text: '13路', value: 13},
        {text: '17路', value: 17},
        {text: '19路', value: 19}
    ],
    LEVEL_OPTIONS: [
        {text: '0', value: 0},
        {text: '1', value: 1},
        {text: '2', value: 2},
        {text: '3', value: 3}
    ],
    BOOK_LIST: ['手筋专项训练：从入门到10级', '快乐学围棋1', '快乐学围棋2', '快乐学围棋3'],
};
