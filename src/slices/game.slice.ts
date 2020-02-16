import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Namespacer} from "./Namespacer";
import _ from "lodash";
import {StandardError} from "../api";

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
  ensureAuthStart:
    namespacer.qualify('[0] ensureAuthStart'),
  ensureAuthEnd:
    namespacer.qualify('[1] ensureAuthEnd'),
  getMeStart:
    namespacer.qualify('[0] getMeStart'),
  getMeEnd:
    namespacer.qualify('[1] getMeEnd'),
  getMeEndNotLoggedIn:
    namespacer.qualify('[2] getMeEndNotLoggedIn'),
  worldRequestEndNotLoggedIn:
    namespacer.qualify('worldRequestEndNotLoggedIn'),
  worldRequestEndUserNotInRoom:
    namespacer.qualify('worldRequestEndUserNotInRoom'),
  loginStart:
    namespacer.qualify('[2] loginStart'),
  loginEnd:
    namespacer.qualify('[3] loginEnd'),
  loginEndFail:
    namespacer.qualify('[3] loginEndFail'),
  registerStart:
    namespacer.qualify('[4] registerStart'),
  registerEnd:
    namespacer.qualify('[5] registerEnd'),
  registerEndFail:
    namespacer.qualify('[5] registerEndFail'),
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
  requestActStart:
    namespacer.qualify('[0] requestActStart'),
  requestActEnd:
    namespacer.qualify('[0] requestActEnd'),
  navigateAwayFromRoom:
    namespacer.qualify('[0] navigateAwayFromRoom'),
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
  updateFreqMs: number
  grid: Grid
}

export function eq<T>(
  t1: T|undefined|null,
  t2: T|undefined|null,
  equator: (t1: T, t2: T) => boolean):
  boolean {
  if (typeof t1 === 'undefined' || t1 === null) {
    return typeof t2 === 'undefined' || t2 === null
  }
  if (typeof t2 === 'undefined' || t2 === null) {
    return false;
  }
  return equator(t1, t2);
}

export function eqPosition(p1: Position, p2: Position): boolean {
  return p1.x === p2.x
  && p1.y === p2.y
}

export function eqUser(u1: User, u2: User): boolean {
  return u1.id === u2.id
  && u1.name === u2.name
}

export function eqEntity(e1: Entity, e2: Entity): boolean {
  return e1.id === e2.id
  && eq(e1.position, e2.position, eqPosition)
  && eq(e1.user, e2.user, eqUser)
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
    authKnownBad: false,
    user: null as User|null,
    password: null as string|null,
    world: {
      wolves: [],
      hunters: [],
    } as World,
  },
  reducers: {},
  extraReducers: {
    [actionIds.ensureAuthStart]: (state, action: PayloadAction<EnsureAuthStartAction>) => {
      return {
        ...state,
        authKnownBad: true,
      };
    },
    [actionIds.ensureAuthEnd]: (state, action: PayloadAction<EnsureAuthEndAction>) => {
      return {
        ...state,
        authKnownBad: false,
      };
    },
    [actionIds.getMeEnd]: (state, action: PayloadAction<GetMeResponse>) => {
      return {
        ...state,
        user: {
          id: action.payload.id,
          name: action.payload.name,
        }
      };
    },
    [actionIds.registerEnd]: (state, action: PayloadAction<RegisterResponse>) => {
      return {
        ...state,
        user: {
          id: action.payload.id,
          name: action.payload.name,
        },
        password: action.payload.password
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

export interface MessageResponse {
  message: string
}

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

export type UpdateWorldResponse
  = MessageResponse

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

export type Auth
  = GetMeResponse
  | LoginResponse
  | RegisterResponse
export type EnsureAuthStartAction
  = PayloadAction

export const ensureAuthStartAction = ():
  EnsureAuthStartAction => ({
  type: actionIds.ensureAuthStart,
  payload: undefined
})

export type EnsureAuthEndAction
  = PayloadAction<Auth>

export const ensureAuthEndAction = (
  initialAuth: Auth
): EnsureAuthEndAction => ({
  type: actionIds.ensureAuthEnd,
  payload: initialAuth
})

export type GetMeStartAction
  = PayloadAction;

export const getMeStartAction = (): GetMeStartAction => ({
  type: actionIds.getMeStart,
  payload: undefined,
})

export type GetMeResponse
  = User & {
  loggedIn: boolean
}
export type GetMeEndAction
  = PayloadAction<GetMeResponse>

export const getMeEndAction = (
  response: GetMeResponse
): GetMeEndAction => ({
  type: actionIds.getMeEnd,
  payload: response
})

export type GetMeEndNotLoggedInAction
  = PayloadAction

export const getMeEndNotLoggedInAction = (): GetMeEndNotLoggedInAction => ({
  type: actionIds.getMeEndNotLoggedIn,
  payload: undefined
})

export interface LoginRequest {
  userId: string
  password: string
}
export type LoginAction
  = PayloadAction<LoginRequest>;

export const loginStartAction = (loginRequest: LoginRequest): LoginAction => ({
  type: actionIds.loginStart,
  payload: loginRequest,
})

export interface LoginResponse {
  success: boolean
}
export type LoginEndAction
  = PayloadAction<LoginResponse>;

export const loginEndAction = (
  response: LoginResponse
): LoginEndAction => ({
  type: actionIds.loginEnd,
  payload: response
})

export interface LoginEndFailPayload<T = StandardError> {
  errorResponse: T
}
export type LoginEndFailAction<T = StandardError>
  = PayloadAction<LoginEndFailPayload<T>>

export const loginEndFailAction = <T = StandardError>(
  payload: LoginEndFailPayload<T>
): LoginEndFailAction<T> => ({
  type: actionIds.loginEndFail,
  payload
});

export type RegisterStartAction
  = PayloadAction;

export type RegisterResponse
  = User & {
  password: string
};

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

export interface RegisterEndFailPayload<T = StandardError> {
  errorResponse: T
}
export type RegisterEndFailAction<T = StandardError>
  = PayloadAction<RegisterEndFailPayload<T>>

export const registerEndFailAction = <T = StandardError>(
  payload: RegisterEndFailPayload<T>
): RegisterEndFailAction<T> => ({
  type: actionIds.registerEndFail,
  payload
});

interface NominalAction {
  time: string
  room: string
}
export type Contiguous
  = -1|0|1
interface MoveAction extends NominalAction {
  type: 'move'
  x: Contiguous
  y: Contiguous
}

export type GameAction
  = MoveAction;

export type RequestActStartAction
  = PayloadAction<GameAction>;

export const requestActStartAction = (
  gameAction: GameAction
): RequestActStartAction => ({
  type: actionIds.requestActStart,
  payload: gameAction
});

export type RequestActResponse
  = MessageResponse

export const requestActEndAction = (
  response: RequestActResponse
): PayloadAction<RequestActResponse> => ({
  type: actionIds.requestActEnd,
  payload: response,
});

export type NavigateAwayFromRoomAction
  = PayloadAction<string>;

export const navigateAwayFromRoomAction = (
  room: string
): NavigateAwayFromRoomAction => ({
  type: actionIds.navigateAwayFromRoom,
  payload: room
});

export interface WorldRequestEndNotLoggedInPayload<T = StandardError> {
  errorResponse: T
}
export type WorldRequestEndNotLoggedInAction<T = StandardError>
  = PayloadAction<WorldRequestEndNotLoggedInPayload<T>>

export const worldRequestEndNotLoggedInAction = <T = StandardError>(
  payload: WorldRequestEndNotLoggedInPayload<T>
): WorldRequestEndNotLoggedInAction<T> => ({
  type: actionIds.worldRequestEndNotLoggedIn,
  payload
})

export interface WorldRequestEndUserNotInRoom<T = StandardError> {
  errorResponse: T
}
export type WorldRequestEndUserNotInRoomAction<T = StandardError>
  = PayloadAction<WorldRequestEndUserNotInRoom<T>>

export const worldRequestEndUserNotInRoomAction = <T = StandardError>(
  payload: WorldRequestEndUserNotInRoom<T>
): WorldRequestEndUserNotInRoomAction<T> => ({
  type: actionIds.worldRequestEndUserNotInRoom,
  payload
})
