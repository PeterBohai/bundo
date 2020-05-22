import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import HomePage from './components/HomePage'
import Register from './components/Register'
import Login from './components/Login'
import Account from './components/Account'
import SearchResults from './components/SearchResults'

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/query/:search" >
					<SearchResults />
				</Route>
				
				<Route path="/register" component={Register} />
				<Route path="/login" component={Login} />
				<Route path="/account" component={Account} />
				<Route path="/" component={HomePage} />
			</Switch>
				
		</Router>
	)
}

export default App
