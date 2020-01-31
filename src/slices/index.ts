import {combineReducers} from "@reduxjs/toolkit";
import {gameReducer} from "./game.slice";

export * from './game.slice';

export const rootReducer = combineReducers({
  game: gameReducer,
});
