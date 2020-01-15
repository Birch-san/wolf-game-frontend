export interface Position {
  y: number
  x: number
}

export interface Hunter {
  pos: Position
}

export interface Wolf {
  pos: Position
}

export interface GameState {
  wolves: Wolf[]
  hunters: Hunter[]
}

export const MOVE_WOLF = 'MOVE_WOLF'
export const MOVE_HUNTER = 'MOVE_HUNTER'

interface MoveWolfAction {
  type: typeof MOVE_WOLF
  payload: Position
}

interface MoveHunterAction {
  type: typeof MOVE_HUNTER
  payload: Position
}

export type GameActionTypes
  = MoveWolfAction
  | MoveHunterAction
