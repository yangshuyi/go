import _ from 'lodash';

/**
 * 常量类
 */
export default {
    CHESS_TYPE: {
        B: {text: '黑棋', value: 'B', color: 'black', markedColor: 'white', nextStep: 'W'},
        W: {text: '白棋', value: 'W', color: 'white', markedColor: 'black', nextStep: 'B'},
        C: {text: '空', value: 'C', color: 'transparent', markedColor: 'transparent'},
    },
    CHESS_BOARD_LABEL: {
        "01": {row1: '一', column1: '1', row2: '1', column2: 'A'},
        "02": {row1: '二', column1: '2', row2: '2', column2: 'B'},
        "03": {row1: '三', column1: '3', row2: '3', column2: 'C'},
        "04": {row1: '四', column1: '4', row2: '4', column2: 'D'},
        "05": {row1: '五', column1: '5', row2: '5', column2: 'E'},
        "06": {row1: '六', column1: '6', row2: '6', column2: 'F'},
        "07": {row1: '七', column1: '7', row2: '7', column2: 'G'},
        "08": {row1: '八', column1: '8', row2: '8', column2: 'H'},
        "09": {row1: '九', column1: '9', row2: '9', column2: 'J'},
        "10": {row1: '十', column1: '10', row2: '10', column2: 'K'},
        "11": {row1: '十一', column1: '11', row2: '11', column2: 'L'},
        "12": {row1: '十二', column1: '12', row2: '12', column2: 'M'},
        "13": {row1: '十三', column1: '13', row2: '13', column2: 'N'},
        "14": {row1: '十四', column1: '14', row2: '14', column2: 'O'},
        "15": {row1: '十五', column1: '15', row2: '15', column2: 'P'},
        "16": {row1: '十六', column1: '16', row2: '16', column2: 'Q'},
        "17": {row1: '十七', column1: '17', row2: '17', column2: 'R'},
        "18": {row1: '十八', column1: '18', row2: '18', column2: 'S'},
        "19": {row1: '十九', column1: '19', row2: '19', column2: 'T'},
    },

    CHESS_BOARD_SIZE_OPTIONS: [
        {
            text: '9路', value: 9
        },
        {
            text: '11路', value: 11
        },
        {
            text: '13路', value: 13
        },
        {
            text: '17路', value: 17
        },
        {
            text: '19路', value: 19
        }
    ],
    LEVEL_OPTIONS: {
        "0": {value: "0", text: '通过', icon: 'passed', iconColor: 'green'},
        "1": {value: "1", text: '巩固', icon: 'warning-o', iconColor: 'red'},
        "2": {value: "2", text: '错误', icon: 'close', iconColor: 'red'},
        "3": {value: "3", text: '新题', icon: 'question-o', iconColor: 'black'},
    },
    BOOK_LIST: ['手筋专项训练：从入门到10级', '快乐学围棋1', '快乐学围棋2', '快乐学围棋3', '弈学院上课练习', '弈学院三步计算力'],


};
