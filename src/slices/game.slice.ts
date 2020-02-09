import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Namespacer} from "./Namespacer";
import _ from "lodash";

export interface Position {
  y: number
  x: number
}

export interface User {
  id: string
  name: string
}

export interface Entity {
  id: string
  position?: Position
  user?: User
}

export interface Player {
  score: number
}

export interface Hunter {
  player: Player
  entity: Entity
}

export interface Wolf {
  player: Player
  entity: Entity
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
  wolves: Wolf[]
  hunters: Hunter[]
}

export interface Room {
  name: string
  grid: Grid
}

export interface User {
  id: string
  name: string
}

export function eqEntity(e1: Entity, e2: Entity): boolean {
  return e1.id === e2.id;
}

export function eqGrid(g1: Grid, g2: Grid): boolean {
  return JSON.stringify(g1) === JSON.stringify(g2);
}

export function eqHunter(h1: Hunter, h2: Hunter): boolean {
  return eqEntity(h1.entity, h2.entity);
}

export function eqWolf(w1: Wolf, w2: Wolf): boolean {
  return eqEntity(w1.entity, w2.entity);
}

/**
 * @param h1 sorted list of hunters
 * @param h2 sorted list of hunters
 */
export function eqHunters(h1: Hunter[], h2: Hunter[]): boolean {
  return h1.length === h2.length
    && _.zip(h1, h2)
      .reduce((acc: boolean, [h1, h2]: [Hunter|undefined, Hunter|undefined]): boolean =>
      acc && eqHunter(h1!!, h2!!), true);
}

/**
 * @param w1 sorted list of wolves
 * @param w2 sorted list of wolves
 */
export function eqWolves(w1: Wolf[], w2: Wolf[]): boolean {
  return w1.length === w2.length
  && _.zip(w1, w2)
      .reduce((acc: boolean, [w1, w2]: [Wolf|undefined, Wolf|undefined]): boolean =>
      acc && eqWolf(w1!!, w2!!), true);
}

function compareHunter(h1: Hunter, h2: Hunter): number {
  return compareEntity(h1.entity, h2.entity);
}

function compareWolf(w1: Wolf, w2: Wolf): number {
  return compareEntity(w1.entity, w2.entity);
}

function compareEntity(e1: Entity, e2: Entity): number {
  return e1.id.localeCompare(e2.id);
}

const slice = createSlice({
  name: namespace,
  initialState: {
    grid: [[]] as Grid,
    user: null as User|null,
    world: {
      wolves: [],
      hunters: [],
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
        world: {
          ...state.world,
          wolves: action.payload.wolves.sort(compareWolf),
          hunters: action.payload.hunters.sort(compareHunter),
        }
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
