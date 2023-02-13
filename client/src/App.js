import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Account from "./pages/Account";
import SearchResults from "./pages/SearchResults";

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
                <Route exact path="/logout">
                    <Logout />
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
