import {
  all,
  call,
  cancel,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
  takeLatest,
  takeLeading,
  throttle
} from 'redux-saga/effects';
import {act, ApiOutcome, getMe, getRoom, getWorld, login, register, updateWorld} from '../api';
import {
  ensureAuthEndAction,
  ensureAuthStartAction,
  gameActionIds,
  GetMeEndAction,
  getMeEndAction,
  GetMeEndNotLoggedInAction,
  getMeEndNotLoggedInAction,
  GetMeResponse,
  getMeStartAction,
  getWorldEndAction,
  GetWorldResponse,
  getWorldStartAction,
  GetWorldStartAction,
  JoinRoomEndAction,
  joinRoomEndAction,
  JoinRoomResponse,
  JoinRoomStartAction,
  LoginAction,
  LoginEndAction,
  loginEndAction,
  LoginEndFailAction,
  loginEndFailAction,
  LoginResponse,
  loginStartAction,
  RegisterEndAction,
  registerEndAction,
  RegisterEndFailAction,
  RegisterResponse,
  registerStartAction,
  requestActEndAction,
  RequestActResponse,
  RequestActStartAction,
  updateWorldEndAction,
  UpdateWorldResponse,
  updateWorldStartAction,
  UpdateWorldStartAction,
  User,
  WorldRequestEndNotLoggedInAction,
  worldRequestEndNotLoggedInAction
} from "../slices";
import {Task} from 'redux-saga';
import {RootState} from "../store";

export function* watchEnsureAuthStart() {
  yield takeLeading(
    gameActionIds.ensureAuthStart,
    ensureAuth
  )
}

export function* watchAuth() {
  yield all([
    fork(watchGetMeStart),
    // fork(watchGetMeEndNotLoggedIn),
    fork(watchWorldRequestEndNotLoggedIn),
    fork(watchLoginStart),
    fork(watchRegisterStart),
    fork(watchEnsureAuthStart),
  ])
}

export function* ensureAuth() {
  const user: User|null = yield select((state: RootState) => state.game.user)
  if (user) {
    const password: string|null = yield select((state: RootState) => state.game.password)
    if (password) {
      // yield put(loginStartAction({
      //   userId: user.id,
      //   password
      // }));
      const [{ loggedIn, loginFail }]: [{
        loggedIn?: LoginEndAction,
        loginFail?: LoginEndFailAction
      }] = yield all([
        race({
          loggedIn: take(gameActionIds.loginEnd),
          notLoggedIn: take(gameActionIds.loginEndFail)
        }),
        put(loginStartAction({
          userId: user.id,
          password
        }))
      ]);
      if (loggedIn) {
        if (loggedIn.payload.success) {
          yield put(ensureAuthEndAction(loggedIn.payload));
          return
        }
        // fall-through (wrong credentials [maybe our password is wrong or user deleted], so try register instead)
      } else {
        console.warn(`Encountered login error ${JSON.stringify(loginFail?.payload.errorResponse)}>. Will attempt to register new user instead. Cause:`, loginFail?.payload.error)
      }
      // fall-through (login's failing [maybe our password is wrong or user deleted], so try register instead)
    }
    // fall-through (we lack a password, so register new user)
  } else {
    // yield put(getMeStartAction());
    const [{ loggedIn, notLoggedIn }]: [{
      loggedIn?: GetMeEndAction,
      notLoggedIn?: GetMeEndNotLoggedInAction
    }] = yield all([
      race({
        loggedIn: take(gameActionIds.getMeEnd),
        notLoggedIn: take(gameActionIds.getMeEndNotLoggedIn)
      }),
      put(getMeStartAction())
    ]);
    if (loggedIn) {
      yield put(ensureAuthEndAction(loggedIn.payload))
      return
    } else {
      console.warn('Not logged in. We have no credentials, so will attempt to register a new user.')
    }
    // fall-through (we lack a session, and have no credentials, so register new user)
  }
  // yield put(registerStartAction())
  const [{ registered, notRegistered }]: [{
    registered?: RegisterEndAction,
    notRegistered?: RegisterEndFailAction
  }] = yield all([
    race({
      registered: take(gameActionIds.registerEnd),
      notRegistered: take(gameActionIds.registerEndFail)
    }),
    put(registerStartAction())
  ]);
  if (registered) {
    yield put(ensureAuthEndAction(registered.payload));
    return
  } else {
    console.error(`Encountered registration error ${JSON.stringify(notRegistered?.payload.errorResponse)}>. Cause:`, notRegistered?.payload.error)
  }
}

export function* watchGetMeStart() {
  yield takeLatest(
    gameActionIds.getMeStart,
    requestGetMe
  )
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

// export function* watchGetMeEndNotLoggedIn() {
//   yield takeLatest(
//     gameActionIds.getMeEndNotLoggedIn,
//     function* () {
//       yield put(ensureAuthStartAction())
//     }
//   )
// }

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

export function* watchWorldRequestEndNotLoggedIn() {
  yield takeLatest(
    gameActionIds.worldRequestEndNotLoggedIn,
    function* (action: WorldRequestEndNotLoggedInAction) {
      console.error(`Encountered auth error ${JSON.stringify(action.payload.errorResponse)}>. Attempting to re-authenticate. Cause:`, action.payload.error)
      yield put(ensureAuthStartAction())
    }
  )
}

export function* watchLoginStart() {
  yield takeLatest(
    gameActionIds.loginStart,
    requestLogin
  )
}

function* requestLogin(loginAction: LoginAction) {
  const { response, errorResponse } : ApiOutcome<LoginResponse>
    = yield call(login, loginAction.payload);
  if (!response) {
    yield put(loginEndFailAction({
      errorResponse,
      error: new Error()
    }))
    return
  }
  yield put(loginEndAction(response))
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
    if (errorResponse?.error === 'NOT_LOGGED_IN') {
      yield put(worldRequestEndNotLoggedInAction({
        errorResponse,
        error: new Error()
      }));
    } else {
      throw errorResponse
    }
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
    if (errorResponse?.error === 'NOT_LOGGED_IN') {
      yield put(worldRequestEndNotLoggedInAction({
        errorResponse,
        error: new Error()
      }));
    } else {
      throw errorResponse
    }
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
