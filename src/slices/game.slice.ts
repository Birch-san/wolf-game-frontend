import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Namespacer} from "./Namespacer";
import {BaseAction} from "../common";

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
} as const;

export type GridTile
  = number;

export type Grid
  = GridTile[][];

export type GetGridResponse
  = Grid;

const slice = createSlice({
  name: namespace,
  initialState: {
    grid: [[]] as Grid,
    wolves: [] as Wolf[],
    hunters: [] as Hunter[],
  },
  reducers: {},
  extraReducers: {
    // moveWolf(state, action: PayloadAction<Position>) {
    //   // state.hunters[0].pos.y++
    // }
    [actionIds.getGridEnd]: (state, action: PayloadAction<GetGridResponse>) => {
      return {
        ...state,
        grid: action.payload
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
