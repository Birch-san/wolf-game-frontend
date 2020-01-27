import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {rootSaga} from './sagas'
import {rootReducer} from "./slices";

export type RootState = ReturnType<typeof rootReducer>

const sagaMiddleware = createSagaMiddleware()
export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), sagaMiddleware]
});

// storeNominal.dispatch

// type INCREMENT = 'INCREMENT'
// type DECREMENT = 'DECREMENT'
// type SagaTypes
//   = INCREMENT
//   | DECREMENT;
//
// type EnhancedStore = {
//   // dispatch(action: INCREMENT): INCREMENT
//   // dispatch(action: DECREMENT): DECREMENT
// } & typeof storeNominal
// export const store: EnhancedStore = storeNominal
// export type AppDispatch = typeof store.dispatch
//
// sagaMiddleware.run(rootSaga)
// const sagaActionCreator = (type: SagaTypes) => store.dispatch({type})
// const sagaAction = sagaActionCreator('INCREMENT')

sagaMiddleware.run(rootSaga, 1500);
