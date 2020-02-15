import React, {useEffect} from "react";
import {Grid} from "./Grid";
import {useParams} from "react-router";
import {joinRoomStartAction} from "../slices";
import {useTypedDispatch} from "../store";
import {Controls} from "./Controls";

export const Room: React.FC = () => {
  const { roomName } = useParams();
  const dispatch = useTypedDispatch()
  useEffect(() => {
    dispatch(joinRoomStartAction(roomName!!))
  }, [roomName]);
  return (
    <div>
      <h3>{roomName}</h3>
      <Grid/>
      <Controls room={roomName!!}/>
    </div>
  )
}
