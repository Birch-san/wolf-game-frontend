import {Grid} from "../slices";

export const getGrid = (): Promise<Grid> =>
  new Promise<Grid>(resolve => setTimeout(() => resolve([[]]), 0));
