import {combineReducers} from "@reduxjs/toolkit";
import {gameReducer} from "./game.slice";
import {numberCollectionReducer} from "./number-collection.slice";

export * from './number-collection.slice';
export * from './game.slice';

export const rootReducer = combineReducers({
  game: gameReducer,
  numberCollection: numberCollectionReducer,
})

// import {
//   numberCollectionReducer,
//   // NumberCollectionState,
// } from './number-collection.reducer';
// import {gameReducer} from "./game";
//

// export interface State {
//   numberCollection: NumberCollectionState;
// }

// export const rootReducers = combineReducers<State>({
//   numberCollection: numberCollectionReducer,
// });


