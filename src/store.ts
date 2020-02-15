import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {rootSaga} from './sagas'
import {rootReducer} from "./slices";
import {useDispatch} from "react-redux";

export type RootState = ReturnType<typeof rootReducer>

const sagaMiddleware = createSagaMiddleware()
export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), sagaMiddleware]
});

export const useTypedDispatch = () => useDispatch<typeof store.dispatch>()
// export const useTypedThunkDispatch = () => useDispatch<typeof store.dispatch>()

sagaMiddleware.run(rootSaga);
