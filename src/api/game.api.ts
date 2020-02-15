import {
  GameAction,
  GetWorldResponse,
  JoinRoomResponse,
  RegisterResponse,
  RequestActResponse,
  UpdateWorldResponse
} from "../slices";
import {apiClient} from "../common/apiClient";
import {encodeUriSegment} from "../utils/PathParamUtils";
import {AxiosError, AxiosResponse} from "axios";

export interface StandardError {
  error: string
  message: string
}
export interface ApiErrorOutcome<E = StandardError> {
  response: undefined
  errorResponse: E|undefined
}
export type ApiOutcome<T, E = StandardError>
  = {
  response: T
  errorResponse: undefined
} | ApiErrorOutcome<E>

function wrapOutcome<T, E = StandardError>(promise: Promise<AxiosResponse<T>>): Promise<ApiOutcome<T, E>> {
  return promise.then((response: AxiosResponse<T>): ApiOutcome<T, E> =>
    ({ response: response.data, errorResponse: undefined }))
    .catch((response: AxiosError<E>): ApiErrorOutcome<E> =>
      ({ response: undefined, errorResponse: response.response?.data }))
}

export const register = (): Promise<ApiOutcome<RegisterResponse>> =>
  wrapOutcome(apiClient.get(`auth/register`));

export const getRoom = (room: string): Promise<ApiOutcome<JoinRoomResponse>> =>
  wrapOutcome(apiClient.get(`room/join/${encodeUriSegment(room)}`));

export const updateWorld = (room: string): Promise<ApiOutcome<UpdateWorldResponse>> =>
  wrapOutcome(apiClient.get(`world/room/${encodeUriSegment(room)}/update`));

export const getWorld = (room: string): Promise<ApiOutcome<GetWorldResponse>> =>
  wrapOutcome(apiClient.get(`world/room/${encodeUriSegment(room)}`));

export const act = (gameAction: GameAction): Promise<ApiOutcome<RequestActResponse>> =>
  wrapOutcome(apiClient.post(`world/room/${encodeUriSegment(gameAction.room)}/act`, gameAction, {
    headers: {
      'Content-type': 'application/json;charset=utf8'
    }
  }));
