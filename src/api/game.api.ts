import {Grid} from "../slices";
import {apiClient} from "../common/apiClient";

export const getGrid = (): Promise<Grid> =>
  apiClient.get('grid')
    .then((response): Grid => response.data);
