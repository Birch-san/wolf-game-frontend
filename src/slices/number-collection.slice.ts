// import {BaseAction, actionIds} from '../common';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {BaseAction} from "../common";
import {Namespacer} from "./Namespacer";

const namespace = 'num' as const
const namespacer = new Namespacer(namespace)

// export type NumberCollectionState = number[];
//
// export const numberCollectionReducer = (
//   state: NumberCollectionState = [0],
//   action: BaseAction
// ) => {
//   switch (action.type) {
//     case actionIds.GET_NUMBER_REQUEST_COMPLETED:
//       return [...state, action.payload];
//   }
//   return state;
// };

const actionIds = {
  GET_NUMBER_REQUEST_START:
    namespacer.qualify('[0] Request a new number to the NumberGenerator async service.'),
  GET_NUMBER_REQUEST_COMPLETED:
    namespacer.qualify('[1] NumberGenerator async service returned a new number.'),
} as const;

const slice = createSlice({
  name: namespace,
  initialState: [] as number[],
  reducers: {},
  extraReducers: {
    // [actionIdsTk.GET_NUMBER_REQUEST_COMPLETED.type]: (state, action) => [...state, action.payload]
    [actionIds.GET_NUMBER_REQUEST_COMPLETED]: (state, action: PayloadAction<number>) => {
      console.debug('gfgf')
      return [...state, action.payload]
    }
  }
});

const { actions, reducer } = slice
// export const { getNumberRequestCompleted } = actions
export { reducer as numberCollectionReducer, actionIds as numberCollectionActionIds }

// export const actionIds = {
//   ...Object.values(actions).map(action => action.type)
// } as const;

export const numberRequestStartAction = (): BaseAction => ({
  type: actionIds.GET_NUMBER_REQUEST_START,
  payload: null,
});

export const numberRequestCompletedAction = (
  numberGenerated: number
): BaseAction => ({
  type: actionIds.GET_NUMBER_REQUEST_COMPLETED,
  payload: numberGenerated,
});
