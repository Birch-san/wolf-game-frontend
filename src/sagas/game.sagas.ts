import {all, call, cancel, delay, fork, put, takeEvery, takeLatest, throttle, take, PutEffect, CallEffect} from 'redux-saga/effects';
import {act, ApiOutcome, getMe, getRoom, getWorld, register, updateWorld} from '../api';
import {
  EnsureInitialAuthEndAction,
  ensureInitialAuthEndAction,
  gameActionIds, GetMeEndAction, getMeEndAction, getMeEndNotLoggedInAction, GetMeResponse,
  getWorldEndAction,
  GetWorldResponse,
  getWorldStartAction,
  GetWorldStartAction,
  JoinRoomEndAction,
  joinRoomEndAction,
  JoinRoomResponse,
  JoinRoomStartAction, loginEndAction,
  registerEndAction,
  RegisterResponse, registerStartAction,
  requestActEndAction,
  RequestActResponse,
  RequestActStartAction,
  updateWorldEndAction,
  UpdateWorldResponse,
  updateWorldStartAction,
  UpdateWorldStartAction
} from "../slices";
import {Task} from 'redux-saga';

export function* watchEnsureInitialAuthStart() {
  yield takeLatest(
    gameActionIds.ensureInitialAuthStart,
    ensureInitialAuth
  )
}

export function* ensureInitialAuth() {
  yield all([
    fork(requestGetMe),
    fork(watchGetMeEndNotLoggedIn),
    fork(watchRegisterStart),
  ]);
}

export function* requestGetMe() {
  const { response, errorResponse } : ApiOutcome<GetMeResponse>
    = yield call(getMe);
  if (!response) {
    throw errorResponse
  }
  if (response.loggedIn) {
    yield put(getMeEndAction(response))
  } else {
    yield put(getMeEndNotLoggedInAction())
  }
}

export function* watchGetMeEndNotLoggedIn() {
  yield takeLatest(
    gameActionIds.getMeEndNotLoggedIn,
    function* () {
      yield put(registerStartAction())
    }
  )
}

export function* watchRegisterStart() {
  yield takeLatest(
    gameActionIds.registerStart,
    requestRegister
  )
}

function* requestRegister() {
  const { response, errorResponse } : ApiOutcome<RegisterResponse>
    = yield call(register);
  if (!response) {
    throw errorResponse
  }
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
  const { response, errorResponse } : ApiOutcome<JoinRoomResponse>
    = yield call(getRoom, action.payload);
  if (response) {
    yield put(joinRoomEndAction(response))
  } else {
    throw errorResponse
  }
}

export function* watchJoinRoomEnd() {
  yield takeLatest(
    gameActionIds.joinRoomEnd,
    initRoom
  )
}

function* initRoom(action: JoinRoomEndAction) {
  const task: Task = yield all([
    fork(watchGetWorldStart),
    fork(repeatedlyRequestGetWorld, getWorldStartAction(action.payload.name), action.payload.updateFreqMs),
    fork(watchUpdateWorldStart),
    fork(repeatedlyRequestUpdateWorld, updateWorldStartAction(action.payload.name), action.payload.updateFreqMs),
    fork(watchActionRequestStart, action.payload.updateFreqMs),
    fork(function*() {
      yield takeEvery(
        gameActionIds.navigateAwayFromRoom,
        function*() {
          yield cancel(task)
        }
      )
    }),
  ])
}

export function* watchActionRequestStart(intervalMs: number) {
  yield throttle(
    intervalMs,
    gameActionIds.requestActStart,
    requestAct
  )
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
  const { response, errorResponse } : ApiOutcome<GetWorldResponse>
    = yield call(getWorld, action.payload);
  if (response) {
    yield put(getWorldEndAction(response));
  } else {
    throw errorResponse
  }
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
  const { response, errorResponse } : ApiOutcome<UpdateWorldResponse>
    = yield call(updateWorld, action.payload);
  if (response) {
    yield put(updateWorldEndAction(response));
  } else {
    throw errorResponse
  }
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
