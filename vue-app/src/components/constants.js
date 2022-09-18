import _ from 'lodash';

/**
 * 常量类
 */
export default {
    CHESS_TYPE: {
        BLACK: {text: '黑棋', value: 'BLACK', color:'black', markedColor: 'white', nextStep: 'WHITE'},
        WHITE: {text: '黑棋', value: 'BLACK', color:'white', markedColor: 'black', nextStep: 'BLACK'},
        CLEAR: {text: '空', value: 'CLEAR', color:'transparent', markedColor: 'transparent'},
    }
};
