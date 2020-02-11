import {all, fork} from 'redux-saga/effects';
import {watchRegisterStart, watchRoomJoins} from "./game.sagas";

export const rootSaga = function* root() {
  yield all([
    fork(watchRegisterStart),
    fork(watchRoomJoins)
  ])
};
