import {all, fork, take} from 'redux-saga/effects';
import {repeatedlyRequestNewGeneratedNumber, watchNewGeneratedNumberRequestStart} from './number-collection.sagas';
import {watchGetGridStart} from "./game.sagas";
import {gameActionIds} from "../slices";
// import {watchGetGridStart} from "./game.sagas";
// import {getGrid} from "../api";

export const rootSaga = function* root(intervalMs: number) {
  yield fork(watchGetGridStart)
  yield take(gameActionIds.getGridEnd)
  yield all([
    fork(repeatedlyRequestNewGeneratedNumber, intervalMs),
    fork(watchNewGeneratedNumberRequestStart)
  ]);
};
