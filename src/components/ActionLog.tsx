import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {eqActionHistory} from "../slices";

export const ActionLog: React.FC = () => {
  const actionHistory = useSelector((state: RootState) => state.game.actionHistory, eqActionHistory)
  return (
    <div>

    </div>
  )
}
