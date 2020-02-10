import React, {KeyboardEventHandler, KeyboardEvent, MouseEventHandler} from "react";
import styles from './Controls.module.scss'
import useEventListener from '@use-it/event-listener'
import {useTypedDispatch} from "../store";
import {Contiguous, requestActAction} from "../slices";

interface ControlProps {
  onClick: MouseEventHandler<HTMLButtonElement>
}
export const Control: React.FC<ControlProps> = ({ children, onClick }) => {
  return (
    <button className={styles.actionControl} onClick={onClick}>{children}</button>
  )
}

export const Controls: React.FC = () => {
  const dispatch = useTypedDispatch();
  const requestMove = (x: Contiguous, y: Contiguous) => {
    dispatch(requestActAction({
      type: 'move',
      x,
      y,
    }))
  }
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
      <Control onClick={() => requestMove(0, 1)}>Right</Control>
    </div>
  )
};
