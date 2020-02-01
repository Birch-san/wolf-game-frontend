import {fork, all} from 'redux-saga/effects';
import {watchJoinRoomEnd, watchJoinRoomStart} from "./game.sagas";

export const rootSaga = function* root(intervalMs: number) {
  yield all([
    fork(watchJoinRoomStart),
    fork(watchJoinRoomEnd, intervalMs)
  ])
};
