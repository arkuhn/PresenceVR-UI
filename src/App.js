import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Homepage from "./components/Homepage/Homepage";
import InterviewPage from "./components/InterviewPage/InterviewPage";
import LoginPage from "./components/LoginPage/LoginPage";
import UploadPage from "./components/UploadPage/Upload";
import aframe_string from "./js/aframe.js";
var aframe_html = { __html: aframe_string };


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      networkedEntities: []
    };
  }

  componentDidMount() {
    window.NAF.schemas.add({
      template: '#avatar-template',
      components: [
        'position',
        'rotation',
        'scale',
        {
          selector: '.head',
          component: 'material',
          property: 'color'
        }
      ]
    });
  }

  
  render() {
    return (
      <div dangerouslySetInnerHTML={aframe_html} />
    );
  }
}

export default App;
