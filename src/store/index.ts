import {gameReducer} from './game'
import {combineReducers, configureStore} from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  game: gameReducer
})

export type RootState = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  middleware: []
});
