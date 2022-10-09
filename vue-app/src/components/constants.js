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
        {
            text: '9路', value: 9, label: [
                {row1: '一', column1: '1', row2: '9', column2: 'A'},
                {row1: '二', column1: '2', row2: '8', column2: 'B'},
                {row1: '三', column1: '3', row2: '7', column2: 'C'},
                {row1: '四', column1: '4', row2: '6', column2: 'D'},
                {row1: '五', column1: '5', row2: '5', column2: 'E'},
                {row1: '六', column1: '6', row2: '4', column2: 'F'},
                {row1: '七', column1: '7', row2: '3', column2: 'G'},
                {row1: '八', column1: '8', row2: '2', column2: 'H'},
                {row1: '九', column1: '9', row2: '1', column2: 'J'},
            ]
        },
        {
            text: '11路', value: 11, label: [
                {row1: '一', column1: '1', row2: '11', column2: 'A'},
                {row1: '二', column1: '2', row2: '10', column2: 'B'},
                {row1: '三', column1: '3', row2: '9', column2: 'C'},
                {row1: '四', column1: '4', row2: '8', column2: 'D'},
                {row1: '五', column1: '5', row2: '7', column2: 'E'},
                {row1: '六', column1: '6', row2: '6', column2: 'F'},
                {row1: '七', column1: '7', row2: '5', column2: 'G'},
                {row1: '八', column1: '8', row2: '4', column2: 'H'},
                {row1: '九', column1: '9', row2: '3', column2: 'J'},
                {row1: '十', column1: '10', row2: '2', column2: 'K'},
                {row1: '十一', column1: '11', row2: '1', column2: 'L'},
            ]
        },
        {
            text: '13路', value: 13, label: [
                {row1: '一', column1: '1', row2: '13', column2: 'A'},
                {row1: '二', column1: '2', row2: '12', column2: 'B'},
                {row1: '三', column1: '3', row2: '11', column2: 'C'},
                {row1: '四', column1: '4', row2: '10', column2: 'D'},
                {row1: '五', column1: '5', row2: '9', column2: 'E'},
                {row1: '六', column1: '6', row2: '8', column2: 'F'},
                {row1: '七', column1: '7', row2: '7', column2: 'G'},
                {row1: '八', column1: '8', row2: '6', column2: 'H'},
                {row1: '九', column1: '9', row2: '5', column2: 'J'},
                {row1: '十', column1: '10', row2: '4', column2: 'K'},
                {row1: '十一', column1: '11', row2: '3', column2: 'L'},
                {row1: '十二', column1: '12', row2: '2', column2: 'M'},
                {row1: '十三', column1: '13', row2: '1', column2: 'N'},
            ]
        },
        {
            text: '17路', value: 17, label: [
                {row1: '一', column1: '1', row2: '17', column2: 'A'},
                {row1: '二', column1: '2', row2: '16', column2: 'B'},
                {row1: '三', column1: '3', row2: '15', column2: 'C'},
                {row1: '四', column1: '4', row2: '14', column2: 'D'},
                {row1: '五', column1: '5', row2: '13', column2: 'E'},
                {row1: '六', column1: '6', row2: '12', column2: 'F'},
                {row1: '七', column1: '7', row2: '11', column2: 'G'},
                {row1: '八', column1: '8', row2: '10', column2: 'H'},
                {row1: '九', column1: '9', row2: '9', column2: 'J'},
                {row1: '十', column1: '10', row2: '8', column2: 'K'},
                {row1: '十一', column1: '11', row2: '7', column2: 'L'},
                {row1: '十二', column1: '12', row2: '6', column2: 'M'},
                {row1: '十三', column1: '13', row2: '5', column2: 'N'},
                {row1: '十四', column1: '14', row2: '4', column2: 'O'},
                {row1: '十五', column1: '15', row2: '3', column2: 'P'},
                {row1: '十六', column1: '16', row2: '2', column2: 'Q'},
                {row1: '十七', column1: '17', row2: '1', column2: 'R'},
            ]
        },
        {
            text: '19路', value: 19, label: [
                {row1: '一', column1: '1', row2: '19', column2: 'A'},
                {row1: '二', column1: '2', row2: '18', column2: 'B'},
                {row1: '三', column1: '3', row2: '17', column2: 'C'},
                {row1: '四', column1: '4', row2: '16', column2: 'D'},
                {row1: '五', column1: '5', row2: '15', column2: 'E'},
                {row1: '六', column1: '6', row2: '14', column2: 'F'},
                {row1: '七', column1: '7', row2: '13', column2: 'G'},
                {row1: '八', column1: '8', row2: '12', column2: 'H'},
                {row1: '九', column1: '9', row2: '11', column2: 'J'},
                {row1: '十', column1: '10', row2: '10', column2: 'K'},
                {row1: '十一', column1: '11', row2: '9', column2: 'L'},
                {row1: '十二', column1: '12', row2: '8', column2: 'M'},
                {row1: '十三', column1: '13', row2: '7', column2: 'N'},
                {row1: '十四', column1: '14', row2: '6', column2: 'O'},
                {row1: '十五', column1: '15', row2: '5', column2: 'P'},
                {row1: '十六', column1: '16', row2: '4', column2: 'Q'},
                {row1: '十七', column1: '17', row2: '3', column2: 'R'},
                {row1: '十八', column1: '18', row2: '2', column2: 'S'},
                {row1: '十九', column1: '19', row2: '1', column2: 'T'},
            ]
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
