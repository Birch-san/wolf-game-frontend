import React from 'react';
import './App.css';
import {Room} from '.';
import {Route, Switch} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../store";

export const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.game.user)
  if (!user) {
    return (
      <p>Not logged in</p>
    )
  }
  return (
    <Switch>
      <Route path={'/room/:roomName'}>
        <Room/>
      </Route>
      <Route path={'/'}>
        Please navigate to a room.
      </Route>
    </Switch>
  );
};
