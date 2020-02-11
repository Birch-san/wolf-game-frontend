import {all, call, debounce, delay, fork, put, takeLatest} from 'redux-saga/effects';
import {act, getRoom, getWorld, register, updateWorld} from '../api';
import {
  gameActionIds,
  getWorldEndAction,
  GetWorldResponse,
  getWorldStartAction,
  GetWorldStartAction,
  JoinRoomEndAction,
  joinRoomEndAction,
  JoinRoomResponse,
  JoinRoomStartAction,
  registerEndAction,
  RegisterResponse,
  requestActEndAction,
  RequestActResponse,
  RequestActStartAction,
  updateWorldEndAction,
  UpdateWorldResponse,
  updateWorldStartAction,
  UpdateWorldStartAction
} from "../slices";

export function* watchRegisterStart() {
  yield takeLatest(
    gameActionIds.registerStart,
    requestRegister
  )
}

function* requestRegister() {
  const response: RegisterResponse = yield call(register);
  yield put(registerEndAction(response))
}

// export function* watchRegisterEnd(intervalMs: number) {
//   yield takeLatest(
//     gameActionIds.registerEnd,
//     watchRoomJoins.bind(null, intervalMs)
//   )
// }

export function* watchRoomJoins() {
  yield all([
    fork(watchJoinRoomStart),
    fork(watchJoinRoomEnd)
  ])
}

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

export function* watchJoinRoomEnd() {
  yield takeLatest(
    gameActionIds.joinRoomEnd,
    initRoom
  )
}

function* initRoom(action: JoinRoomEndAction) {
  yield all([
    fork(watchGetWorldStart),
    fork(repeatedlyRequestGetWorld, getWorldStartAction(action.payload.name), action.payload.updateFreqMs),
    fork(watchUpdateWorldStart),
    fork(repeatedlyRequestUpdateWorld, updateWorldStartAction(action.payload.name), action.payload.updateFreqMs),
    fork(watchActionRequestStart, action.payload.updateFreqMs),
  ])
}

export function* watchActionRequestStart(intervalMs: number) {
  yield debounce(
    intervalMs,
    gameActionIds.requestActStart,
    requestAct
  );
}

function* requestAct(action: RequestActStartAction) {
  try {
    const response: RequestActResponse = yield call(act, action.payload);
    yield put(requestActEndAction(response));
  } catch(err) {
    console.error(err)
  }
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
    try {
      yield call(requestGetWorld.bind(null, action))
    } catch(err) {
      console.error(err)
    }
    yield delay(intervalMs)
  }
}

export function* watchUpdateWorldStart() {
  yield takeLatest(
    gameActionIds.updateWorldStart,
    requestUpdateWorld
  );
}

function* requestUpdateWorld(action: UpdateWorldStartAction) {
  const response: UpdateWorldResponse = yield call(updateWorld, action.payload);
  yield put(updateWorldEndAction(response));
}

export function* repeatedlyRequestUpdateWorld(action: UpdateWorldStartAction, intervalMs: number) {
  yield delay(intervalMs/2)
  while(true) {
    try {
      yield call(requestUpdateWorld.bind(null, action))
    } catch(err) {
      console.error(err)
    }
    yield delay(intervalMs)
  }
}
