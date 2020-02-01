import {all, call, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {getRoom, getWorld} from '../api';
import {
  gameActionIds,
  getWorldEndAction,
  GetWorldResponse, getWorldStartAction, GetWorldStartAction, JoinRoomEndAction,
  joinRoomEndAction,
  JoinRoomResponse,
  JoinRoomStartAction
} from "../slices";

export function* watchJoinRoomStart() {
  yield takeLatest(
    gameActionIds.joinRoomStart,
    requestJoinRoom
  )
}

function* requestJoinRoom(action: JoinRoomStartAction) {
  const response: JoinRoomResponse = yield call(getRoom, action.payload);
  yield put(joinRoomEndAction(response))
}

export function* watchJoinRoomEnd(intervalMs: number) {
  yield takeLatest(
    gameActionIds.joinRoomEnd,
    initRoom.bind(null, intervalMs)
  )
}

function* initRoom(intervalMs: number, action: JoinRoomEndAction) {
  yield all([
    fork(watchGetWorldStart),
    fork(repeatedlyRequestGetWorld, getWorldStartAction(action.payload.name), intervalMs),
  ])
}

export function* watchGetWorldStart() {
  yield takeLatest(
    gameActionIds.getWorldStart,
    requestGetWorld
  );
}

function* requestGetWorld(action: GetWorldStartAction) {
  const response: GetWorldResponse = yield call(getWorld, action.payload);
  yield put(getWorldEndAction(response));
}

export function* repeatedlyRequestGetWorld(action: GetWorldStartAction, intervalMs: number) {
  while(true) {
    yield call(requestGetWorld.bind(null, action))
    yield delay(intervalMs)
  }
}
