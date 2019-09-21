import React from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";
import BizResults from "./components/BizResults";

function App() {
	return (
		<Router>
			<Route path="/" exact component={HomePage} />
			<Route path="/register" exact component={Register} />
			<Route path="/login" exact component={Login} />
			<Route path="/biz/:bizAlias" exact component={BizResults} />	
		</Router>

	);
}

export default App;
