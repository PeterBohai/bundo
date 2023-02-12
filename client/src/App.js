import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Account from "./components/Account";
import SearchResults from "./components/SearchResults";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/query/:search">
                    <SearchResults />
                </Route>
                <Route exact path="/register">
                    <Register />
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/user/:details">
                    <Account />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
