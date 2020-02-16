import React, {useEffect} from "react";
import {Grid} from "./Grid";
import {useParams} from "react-router";
import {joinRoomStartAction, navigateAwayFromRoomAction} from "../slices";
import {useTypedDispatch} from "../store";
import {Controls} from "./Controls";
import {ActionLog} from "./ActionLog";

export const Room: React.FC = () => {
  const { roomName } = useParams();
  const dispatch = useTypedDispatch()
  useEffect(() => {
    dispatch(joinRoomStartAction(roomName!!))
    return () => {
      dispatch(navigateAwayFromRoomAction(roomName!!))
    }
  }, [roomName]);
  return (
    <div>
      <h3>{roomName}</h3>
      <Grid/>
      <Controls room={roomName!!}/>
      <ActionLog/>
    </div>
  )
}
