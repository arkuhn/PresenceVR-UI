import AssetMgmt from "./components/AssetMgmt/AssetMgmt";
import RoomList from "./components/RoomList/RoomList";
import Homepage from "./components/Homepage/Homepage";
import LoginPage from "./components/LoginPage/LoginPage"
import InterviewPage from "./components/InterviewPage/InterviewPage"
import UploadPage from "./components/UploadPage/Upload";
import { BrowserRouter, Switch, Route } from 'react-router-dom';

var ReactDOM = require('react-dom');
var React = require('react');

let root = document.getElementById('root');

ReactDOM.render((
	<div>
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"></link>
		<BrowserRouter>
		<Switch>
			<Route exact path='/' component = {LoginPage} />
			<Route exact path='/home' component = {Homepage} />
			<Route exact path='/rooms' component = {RoomList} />
			<Route exact path='/interview/:id' component = {InterviewPage}/>
			<Route exact path='/uploads' component = {UploadPage} />
		</Switch>
	</BrowserRouter>
	</div>
	
), root);
