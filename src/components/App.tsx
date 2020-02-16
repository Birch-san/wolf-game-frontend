import React from 'react';
import './App.css';
import {Room} from '.';
import {Route, Switch} from "react-router";
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {eq, eqUser, User} from "../slices";

export const App: React.FC = () => {
  const user = useSelector(
    (state: RootState) => state.game.user,
    (left: User|null, right:User|null): boolean =>
    eq(left, right, eqUser))
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
