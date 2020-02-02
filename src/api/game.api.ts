import {GetWorldResponse, JoinRoomResponse, UpdateWorldResponse} from "../slices";
import {apiClient} from "../common/apiClient";
import {encodeUriSegment} from "../utils/PathParamUtils";

export const getRoom = (room: string): Promise<JoinRoomResponse> =>
  apiClient.get(`room/join/${encodeUriSegment(room)}`)
    .then((response): JoinRoomResponse => response.data);

export const updateWorld = (room: string): Promise<UpdateWorldResponse> =>
  apiClient.get(`world/room/${encodeUriSegment(room)}/update`)
    .then((response): UpdateWorldResponse => response.data);

export const getWorld = (room: string): Promise<GetWorldResponse> =>
  apiClient.get(`world/room/${encodeUriSegment(room)}`)
    .then((response): GetWorldResponse => response.data);
