import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import HomePage from './components/HomePage'
import Register from './components/Register'
import Login from './components/Login'
import BizResults from './components/BizResults'
import Account from './components/Account'

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/account" component={Account} />
				<Route path="/biz/:bizAlias" component={BizResults} />
				<Route path="/" component={HomePage} />
			</Switch>
				
		</Router>
	)
}

export default App
