import _ from 'lodash';

import {DateUtils, StringUtils} from "sirius-common-utils";
import DexieDbUtils from "../../module/util/DexieDbUtils";

let bookMapCache = [];

async function syncFromRemote(problemList) {
    let bookMap = _.groupBy(problemList, 'book');
    let bookList = [];
    _.each(bookMap, (items, bookName) => {
        bookList.push({
            bookName: bookName,
            problemCnt: items.length,
            keyword: StringUtils.buildKeyword(bookName),
        })
    });
    bookList = _.orderBy(bookList, ['problemCnt'], ['desc']);

    let db = await DexieDbUtils.getConn();
    await db.books.clear();
    await db.books.bulkPut(bookList);

    await init();
}

async function init() {
    let db = await DexieDbUtils.getConn();
    let bookList = await db.books.toArray();

    bookMapCache = {};
    _.each(bookList, (book) => {
        bookMapCache[book.bookName] = book;
    });
}

function getBooks() {
    let books = _.map(bookMapCache);
    return books;
}

function getBookOptions() {
    let books = getBooks();
    return _.orderBy(books, ['problemCnt'], ['desc']);
}

async function saveBook(bookParam) {
    let bookEntity = bookMapCache[bookParam.bookName];
    if (!bookEntity) {
        bookEntity = {};
    }
    bookEntity.problemCnt = bookParam.problemCnt;
    bookEntity.keyword = bookParam.keyword;

    let db = await DexieDbUtils.getConn();
    await db.books.put(bookEntity);

    await init();
}


export default {
    syncFromRemote: syncFromRemote,
    init: init,
    getBooks: getBooks,
    getBookOptions: getBookOptions,
    saveBook: saveBook,
}