import {call, delay, put, takeLatest} from 'redux-saga/effects';
import {getGrid, getWorld} from '../api';
import {gameActionIds, getGridEndAction, GetGridResponse, getWorldEndAction, GetWorldResponse} from "../slices";

export function* watchGetGridStart() {
  yield takeLatest(
    gameActionIds.getGridStart,
    requestGetGrid
  );
}

function* requestGetGrid() {
  const getGridResponse: GetGridResponse = yield call(getGrid);
  yield put(getGridEndAction(getGridResponse));
}

export function* watchGetWorldStart() {
  yield takeLatest(
    gameActionIds.getWorldStart,
    requestGetGrid
  );
}

function* requestGetWorld() {
  const getWorldResponse: GetWorldResponse = yield call(getWorld);
  yield put(getWorldEndAction(getWorldResponse));
}

export function* repeatedlyRequestGetWorld(intervalMs: number) {
  while(true) {
    yield call(requestGetWorld)
    yield delay(intervalMs)
  }
}
