import {Grid} from "../slices";

let initialNumber = 0;

export const generateNewNumber = (): Promise<number> =>
  new Promise<number>(resolve => setTimeout(() => resolve(++initialNumber), 500));
