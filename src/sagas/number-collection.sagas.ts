import {call, put, takeLatest, delay} from 'redux-saga/effects';
import {generateNewNumber} from '../api';
// import { numberRequestCompletedAction } from '../actions';
// import { actionIds } from '../common';
import {numberCollectionActionIds, numberRequestCompletedAction} from "../slices";

// import {actionIds} from "./sagas-steven";

export function* watchNewGeneratedNumberRequestStart() {
  yield takeLatest(
    numberCollectionActionIds.GET_NUMBER_REQUEST_START,
    requestNewGeneratedNumber
  );
}

function* requestNewGeneratedNumber() {
  const generatedNumber = yield call(generateNewNumber);
  yield put(numberRequestCompletedAction(generatedNumber));
}

export function* repeatedlyRequestNewGeneratedNumber(intervalMs: number) {
  while(true) {
    yield call(requestNewGeneratedNumber)
    yield delay(intervalMs)
  }
}
