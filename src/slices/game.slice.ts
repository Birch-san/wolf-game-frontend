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
  getGridStart:
    namespacer.qualify('[0] getGridStart'),
  getGridEnd:
    namespacer.qualify('[1] getGridEnd'),
  getWorldStart:
    namespacer.qualify('[0] getWorldStart'),
  getWorldEnd:
    namespacer.qualify('[1] getWorldEnd'),
} as const;

export type GridTile
  = number;

export type Grid
  = GridTile[][];

export type GetGridResponse
  = Grid;

export interface World {
  wolves: Dictionary<Wolf>
  hunters: Dictionary<Hunter>
}

export type GetWorldResponse
  = World;

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
    [actionIds.getGridEnd]: (state, action: PayloadAction<GetGridResponse>) => {
      return {
        ...state,
        grid: action.payload
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

export const getGridStartAction = (): PayloadAction<null> => ({
  type: actionIds.getGridStart,
  payload: null,
});

export const getGridEndAction = (
  getGridResponse: GetGridResponse
): PayloadAction<GetGridResponse> => ({
  type: actionIds.getGridEnd,
  payload: getGridResponse,
});

export const getWorldStartAction = (): PayloadAction<null> => ({
  type: actionIds.getWorldStart,
  payload: null,
});

export const getWorldEndAction = (
  getWorldResponse: GetWorldResponse
): PayloadAction<GetWorldResponse> => ({
  type: actionIds.getWorldEnd,
  payload: getWorldResponse,
});
