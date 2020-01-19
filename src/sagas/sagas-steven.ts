import {all, call, CallEffect, fork, put, PutEffect, take} from "redux-saga/effects";
import {Action} from "redux";

export const actionIds = {
  GET_STATIC_NUMBER_REQUEST_START:
    "[0] Request a new static number to the NumberGenerator async service.",
  GET_RANDOM_NUMBER_REQUEST_START:
    "[1] Request a new random number to the NumberGenerator async service.",
  GET_NUMBER_REQUEST_COMPLETED:
    "[2] NumberGenerator async service returned a new number."
} as const;

export type ActionTypes = typeof actionIds[keyof typeof actionIds];
export type ActionTypeOf<
  Action extends BaseAction<ActionTypes, any>
  > = Action extends BaseAction<infer TYPE, any> ? TYPE : never;

export type BaseAction<TYPE extends ActionTypes, PAYLOAD> = Action<TYPE> & {
  payload: PAYLOAD;
};

export type SagaFunction<Action extends BaseAction<any, any>> = (
  action: Action
) => Generator<CallEffect | PutEffect, void, unknown>;

export type GetStaticNumberRequestStartAction = BaseAction<
  typeof actionIds.GET_STATIC_NUMBER_REQUEST_START,
  { value: number }
  >;
export type GetRandomNumberRequestStartAction = BaseAction<
  typeof actionIds.GET_RANDOM_NUMBER_REQUEST_START,
  { min: number; max: number }
  >;
export type GetNumberRequestCompletedAction = BaseAction<
  typeof actionIds.GET_NUMBER_REQUEST_COMPLETED,
  number
  >;

async function generateNewNumberRandom(
  min: number,
  max: number
): Promise<number> {
  return new Promise<number>(resolve => {
    setTimeout(() => {
      const range = max - min;
      const number = min + Math.random() * range;
      resolve(number);
    }, 500);
  });
}

function* requestNewRandomNumber(action: GetRandomNumberRequestStartAction) {
  const { min, max } = action.payload;
  console.log("here 1");
  const generatedNumber = yield call(generateNewNumberRandom, min, max);
  console.log("here 3");
  yield put({
    type: actionIds.GET_NUMBER_REQUEST_COMPLETED,
    payload: generatedNumber
  });
}

async function generateNewNumberStatic(value: number): Promise<number> {
  return new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 500);
  });
}

function* requestNewStaticNumber(
  action: GetStaticNumberRequestStartAction
) {
  const { value } = action.payload;
  console.log("here 2");
  const generatedNumber = yield call(generateNewNumberStatic, value);
  console.log("here 4");
  yield put({
    type: actionIds.GET_NUMBER_REQUEST_COMPLETED,
    payload: generatedNumber
  });
}

function typedTakeEvery<Action extends BaseAction<any, any>>(
  pattern: ActionTypeOf<Action>,
  saga: SagaFunction<Action>
) {
  return fork(function*() {
    while (true) {
      const action: Action = yield take(pattern);
      yield fork(saga, action);
    }
  });
}

export const rootSaga = function* root() {
  yield all([
    typedTakeEvery<GetRandomNumberRequestStartAction>(
      actionIds.GET_RANDOM_NUMBER_REQUEST_START,
      requestNewRandomNumber
    ),
    typedTakeEvery<GetStaticNumberRequestStartAction>(
      actionIds.GET_STATIC_NUMBER_REQUEST_START,
      requestNewStaticNumber
    )
  ]);
};
