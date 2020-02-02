import React from 'react';
import './App.css';
import {Room} from '.';
import {Route, Switch, useRouteMatch} from "react-router";

export const App: React.FC = () => {
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
