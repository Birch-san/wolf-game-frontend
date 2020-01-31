import {all, fork, take} from 'redux-saga/effects';
import {repeatedlyRequestGetWorld, watchGetGridStart, watchGetWorldStart} from "./game.sagas";
import {gameActionIds} from "../slices";

export const rootSaga = function* root(intervalMs: number) {
  yield fork(watchGetGridStart)
  yield take(gameActionIds.getGridEnd)
  yield all([
    fork(repeatedlyRequestGetWorld, intervalMs),
    fork(watchGetWorldStart)
  ]);
};
