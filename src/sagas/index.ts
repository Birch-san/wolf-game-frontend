import {all, fork} from 'redux-saga/effects';
import {watchEnsureInitialAuthStart, watchRoomJoins} from "./game.sagas";

export const rootSaga = function* root() {
  yield all([
    fork(watchEnsureInitialAuthStart),
    fork(watchRoomJoins)
  ])
};
