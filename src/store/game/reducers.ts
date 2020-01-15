import {GameActionTypes, GameState} from "./types";

const initialState: GameState = {
  wolves: [],
  hunters: []
}

export function gameReducer(
  state = initialState,
  action: GameActionTypes
): GameState {
  switch(action.type) {
    case "MOVE_WOLF":
    case "MOVE_HUNTER":
    default:
      return state
  }
}

