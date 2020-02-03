import {all, fork} from 'redux-saga/effects';
import {initRoomBinder, watchRegisterStart, watchRoomJoins} from "./game.sagas";

export const rootSaga = function* root(intervalMs: number) {
  yield all([
    fork(watchRegisterStart),
    fork(watchRoomJoins, initRoomBinder(intervalMs))
  ])
};
