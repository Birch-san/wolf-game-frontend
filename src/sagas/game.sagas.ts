import {call, put, takeLatest} from 'redux-saga/effects';
import {getGrid} from '../api';
// import { numberRequestCompletedAction } from '../actions';
// import { actionIds } from '../common';
import {gameActionIds, getGridEndAction} from "../slices";

// import {actionIds} from "./sagas-steven";

export function* watchGetGridStart() {
  yield takeLatest(
    gameActionIds.getGridStart,
    requestGetGrid
  );
}

function* requestGetGrid() {
  const grid = yield call(getGrid);
  yield put(getGridEndAction(grid));
}
