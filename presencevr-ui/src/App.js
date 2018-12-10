import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Homepage from "./components/Homepage/Homepage";
import InterviewPage from "./components/InterviewPage/InterviewPage";
import LoginPage from "./components/LoginPage/LoginPage";
import UploadPage from "./components/UploadPage/Upload";

class App extends Component {
  render() {
    return (
      <div>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
      <BrowserRouter>
      <Switch>
        <Route exact path='/' component = {LoginPage} />
        <Route exact path='/home' component = {Homepage} />
        <Route exact path='/interview/:id' component = {InterviewPage}/>
        <Route exact path='/uploads' component = {UploadPage} />
      </Switch>
    </BrowserRouter>
    </div>
    );
  }
}

export default App;
