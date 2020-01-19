import {createAction} from "@reduxjs/toolkit";

// export const actionIds = {
//   GET_NUMBER_REQUEST_START:
//     '[0] Request a new number to the NumberGenerator async service.',
//   GET_NUMBER_REQUEST_COMPLETED:
//     '[1] NumberGenerator async service returned a new number.',
// } as const;

export interface BaseAction {
  type: string;
  payload?: any;
}

// export const actionIdsTk = {
//   GET_NUMBER_REQUEST_START: createAction('[0] Request a new number to the NumberGenerator async service.'),
//   GET_NUMBER_REQUEST_COMPLETED: createAction('[1] NumberGenerator async service returned a new number.'),
// };
// export const GET_NUMBER_REQUEST_START = createAction('[0] Request a new number to the NumberGenerator async service.');
// export const GET_NUMBER_REQUEST_START = createAction('[0] Request a new number to the NumberGenerator async service.');
