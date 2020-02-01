import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Namespacer} from "./Namespacer";
import {Dictionary} from "../common/types";

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

const namespace = 'game' as const
const namespacer = new Namespacer(namespace)

const actionIds = {
  joinRoomStart:
    namespacer.qualify('[0] joinRoomStart'),
  joinRoomEnd:
    namespacer.qualify('[1] joinRoomEnd'),
  getWorldStart:
    namespacer.qualify('[0] getWorldStart'),
  getWorldEnd:
    namespacer.qualify('[1] getWorldEnd'),
} as const;

export type GridTile
  = number;

export type Grid
  = GridTile[][];

export interface World {
  wolves: Dictionary<Wolf>
  hunters: Dictionary<Hunter>
}

export type GetWorldResponse
  = World;

export interface Room {
  name: string
  grid: Grid
}

export type JoinRoomResponse
  = Room;

const slice = createSlice({
  name: namespace,
  initialState: {
    grid: [[]] as Grid,
    world: {
      wolves: {},
      hunters: {},
    } as World,
  },
  reducers: {},
  extraReducers: {
    [actionIds.joinRoomEnd]: (state, action: PayloadAction<JoinRoomResponse>) => {
      return {
        ...state,
        grid: action.payload.grid
      };
    },
    [actionIds.getWorldEnd]: (state, action: PayloadAction<GetWorldResponse>) => {
      return {
        ...state,
        world: action.payload
      };
    }
  }
})

const { actions, reducer } = slice
// export const { moveWolf } = actions
export { reducer as gameReducer, actionIds as gameActionIds }

export type GetWorldStartAction
  = PayloadAction<string>

export const getWorldStartAction = (
  room: string
): GetWorldStartAction => ({
  type: actionIds.getWorldStart,
  payload: room,
});

export const getWorldEndAction = (
  response: GetWorldResponse
): PayloadAction<GetWorldResponse> => ({
  type: actionIds.getWorldEnd,
  payload: response,
});

export type JoinRoomStartAction
  = PayloadAction<string>;

export const joinRoomStartAction = (
  room: string
): JoinRoomStartAction => ({
  type: actionIds.joinRoomStart,
  payload: room
})

export type JoinRoomEndAction
  = PayloadAction<JoinRoomResponse>;

export const joinRoomEndAction = (
  response: JoinRoomResponse
): JoinRoomEndAction => ({
  type: actionIds.joinRoomEnd,
  payload: response
})
