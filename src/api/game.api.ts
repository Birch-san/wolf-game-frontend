import {GetGridResponse, GetWorldResponse} from "../slices";
import {apiClient} from "../common/apiClient";

export const getGrid = (): Promise<GetGridResponse> =>
  apiClient.get('grid')
    .then((response): GetGridResponse => response.data);

export const getWorld = (): Promise<GetWorldResponse> =>
  apiClient.get('world')
    .then((response): GetWorldResponse => response.data);
