import { gameReducer } from './game/reducers'
import {combineReducers, createStore} from 'redux';

const rootReducer = combineReducers({
  game: gameReducer
})

export type RootState = ReturnType<typeof rootReducer>

export const store = createStore(rootReducer);
