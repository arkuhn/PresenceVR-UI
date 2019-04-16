import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Homepage from "./components/Homepage/Homepage";
import LoginPage from "./components/LoginPage/LoginPage";

class App extends Component {
  render() {
    return (
      <div>
      <BrowserRouter>
      <Switch>
        <Route exact path='/' component = {LoginPage} />
        <Route exact path='/home' component = {Homepage} />
      </Switch>
    </BrowserRouter>
    </div>
    );
  }
}

export default App;
