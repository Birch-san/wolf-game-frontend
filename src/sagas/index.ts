import {all, fork} from 'redux-saga/effects';
import {watchAuth, watchEnsureAuthStart, watchRoomJoins} from "./game.sagas";

export const rootSaga = function* root() {
  yield all([
    // fork(watchEnsureAuthStart),
    fork(watchAuth),
    fork(watchRoomJoins)
  ])
};
