import React from "react";
import InfoGrabber from "../components/InfoGrabber";
import Timer from "../components/Timer";
import Login from "../components/Login";
import Register from "../components/Register";
import { NavLink, Switch, Route } from "react-router-dom";
import Account from "./Account";

export default function Main() {
  return (
    <Switch>
      <Route exact path="/" component={InfoGrabber}></Route>
      <Route exact path="/account" component={Account}></Route>
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/register" component={Register}></Route>
      <Route exact path="/timer" component={Timer}></Route>
    </Switch>
  );
}
