import React, {useEffect} from "react";
import {Grid} from "./Grid";
import {useParams} from "react-router";
import {eqHunters, eqWolves, Hunter, joinRoomStartAction, navigateAwayFromRoomAction, Wolf} from "../slices";
import {RootState, useTypedDispatch} from "../store";
import {Controls} from "./Controls";
import {useSelector} from "react-redux";

export const Room: React.FC = () => {
  const { roomName } = useParams();
  const dispatch = useTypedDispatch()
  const wolves = useSelector((state: RootState) => state.game.world.wolves, eqWolves);
  const hunters = useSelector((state: RootState) => state.game.world.hunters, eqHunters);
  const you = wolves.find((wolf: Wolf) => wolf.player.isYou)
    || hunters.find((hunter: Hunter) => hunter.player.isYou);

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
      {
        you && <div>Your score: {you!!.player.score}</div>
      }
      <div>Wolf score: {wolves.reduce((acc: number, wolf: Wolf) => acc + wolf.player.score, 0)}</div>
      <div>Hunter score: {hunters.reduce((acc: number, hunter: Hunter) => acc + hunter.player.score, 0)}</div>
    </div>
  )
}
