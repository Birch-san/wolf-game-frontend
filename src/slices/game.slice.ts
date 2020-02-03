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
  registerStart:
    namespacer.qualify('[0] registerStart'),
  registerEnd:
    namespacer.qualify('[1] registerEnd'),
  joinRoomStart:
    namespacer.qualify('[0] joinRoomStart'),
  joinRoomEnd:
    namespacer.qualify('[1] joinRoomEnd'),
  getWorldStart:
    namespacer.qualify('[0] getWorldStart'),
  getWorldEnd:
    namespacer.qualify('[1] getWorldEnd'),
  updateWorldStart:
    namespacer.qualify('[0] updateWorldStart'),
  updateWorldEnd:
    namespacer.qualify('[1] updateWorldEnd'),
} as const;

export type GridTile
  = number;

export type Grid
  = GridTile[][];

export interface World {
  wolves: Dictionary<Wolf>
  hunters: Dictionary<Hunter>
}

export interface Room {
  name: string
  grid: Grid
}

export interface User {
  id: string
  name: string
}

const slice = createSlice({
  name: namespace,
  initialState: {
    grid: [[]] as Grid,
    user: null as User|null,
    world: {
      wolves: {},
      hunters: {},
    } as World,
  },
  reducers: {},
  extraReducers: {
    [actionIds.registerEnd]: (state, action: PayloadAction<RegisterResponse>) => {
      return {
        ...state,
        user: action.payload
      };
    },
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

export type GetWorldResponse
  = World;

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

export type UpdateWorldStartAction
  = PayloadAction<string>

export interface UpdateWorldResponse {};

export const updateWorldStartAction = (
  room: string
): UpdateWorldStartAction => ({
  type: actionIds.updateWorldStart,
  payload: room,
});

export const updateWorldEndAction = (
  response: UpdateWorldResponse
): PayloadAction<UpdateWorldResponse> => ({
  type: actionIds.updateWorldEnd,
  payload: response,
});

export type JoinRoomStartAction
  = PayloadAction<string>;

export type JoinRoomResponse
  = Room;

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

export type RegisterStartAction
  = PayloadAction;

export type RegisterResponse
  = User;

export const registerStartAction = (): RegisterStartAction => ({
  type: actionIds.registerStart,
  payload: undefined,
})

export type RegisterEndAction
  = PayloadAction<RegisterResponse>;

export const registerEndAction = (
  response: RegisterResponse
): RegisterEndAction => ({
  type: actionIds.registerEnd,
  payload: response
})
