import React from "react";
import {Grid} from "./Grid";
import {useParams} from "react-router";

export const Room: React.FC = () => {
  const { roomName } = useParams();
  return (
    <div>
      <h3>{roomName}</h3>
      <Grid/>
    </div>
  )
}
