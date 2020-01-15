import {GameActionTypes, MOVE_HUNTER, MOVE_WOLF, Position} from "./types";

export function moveWolf(position: Position): GameActionTypes {
  return {
    type: MOVE_WOLF,
    payload: position
  }
}

export function moveHunter(position: Position): GameActionTypes {
  return {
    type: MOVE_HUNTER,
    payload: position
  }
}
