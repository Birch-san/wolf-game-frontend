import React, {KeyboardEventHandler, KeyboardEvent, MouseEventHandler} from "react";
import styles from './Controls.module.scss'
import useEventListener from '@use-it/event-listener'
import {RootState, useTypedDispatch} from "../store";
import {Contiguous, eqGrid, eqHunters, eqWolves, Hunter, PlayerType, requestActStartAction, Wolf} from "../slices";
import {useSelector} from "react-redux";

export interface ControlProps {
  onClick: MouseEventHandler<HTMLButtonElement>
}
export const Control: React.FC<ControlProps> = ({ children, onClick }) => {
  return (
    <button className={styles.actionControl} onClick={onClick}>{children}</button>
  )
}

export interface ControlsProps {
  room: string
}

export const Controls: React.FC<ControlsProps> = ({ room}) => {
  const dispatch = useTypedDispatch();
  const wolves = useSelector((state: RootState) => state.game.world.wolves, eqWolves);
  const hunters = useSelector((state: RootState) => state.game.world.hunters, eqHunters);
  const playerType: PlayerType|undefined = (wolves.find((wolf: Wolf) => wolf.player.isYou) && 'wolf')
  || (hunters.find((hunter: Hunter) => hunter.player.isYou) && 'hunter');
  const requestMove = (x: Contiguous, y: Contiguous) => {
    dispatch(requestActStartAction({
      type: 'move',
      time: new Date().toISOString(),
      room,
      x,
      y,
    }))
  };
  const requestBite = () => {
    dispatch(requestActStartAction({
      type: 'bite',
      time: new Date().toISOString(),
      room,
    }))
  };
  const requestPet = () => {
    dispatch(requestActStartAction({
      type: 'pet',
      time: new Date().toISOString(),
      room,
    }))
  };
  const keyHandler: KeyboardEventHandler = ({ key }) => {
    let x: Contiguous = 0,
      y: Contiguous = 0;
    switch(key) {
      case 'ArrowLeft':
        x = -1;
        break;
      case 'ArrowUp':
        y = -1;
        break;
      case 'ArrowDown':
        y = 1;
        break;
      case 'ArrowRight':
        x = 1;
        break;
      default:
        return;
    }
    requestMove(x, y)
  };
  useEventListener<KeyboardEvent>('keydown', keyHandler)
  return (
    <div className={styles.actionControls}>
      <Control onClick={() => requestMove(-1, 0)}>Left</Control>
      <div className={styles.yControls}>
        <Control onClick={() => requestMove(0, -1)}>Up</Control>
        <Control onClick={() => requestMove(0, 1)}>Down</Control>
      </div>
      <Control onClick={() => requestMove(1, 0)}>Right</Control>
      {
        playerType === 'wolf' &&
        <Control onClick={requestBite}>Bite</Control>
      }
      {
        playerType === 'hunter' &&
          <Control onClick={requestPet}>Pet</Control>
      }
    </div>
  )
};
