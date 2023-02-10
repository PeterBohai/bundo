/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import "../stylesheets/Login.css";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Login = ({ prevPath }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const history = useHistory();
    const location = useLocation();

    const handleLogin = (event) => {
        event.preventDefault();
        axios
            .post("/auth/login", {
                email,
                password,
            })
            .then((response) => {
                console.log("Successful log in");
                const user = response.data;
                window.localStorage.setItem("currentBundoUser", JSON.stringify(user));
                if (location.state.prevPath === "/register") {
                    history.go(-2);
                } else {
                    history.goBack();
                }
            })
            .catch((err) => {
                console.log(`Login error\n${err.response.data.error}`);
                setErrorMsg(err.response.data.error);
                setEmail("");
                setPassword("");
            });
    };

    return (
        <div className="text-center Login">
            <NavBar fixedTop={false} />

            <div className="login-main row">
                <div className="col-md-5 col-11 mx-auto" style={{ marginTop: "10rem" }}>
                    <h4 className="signup-subtitle">Log in</h4>
                    <form className="form-signup text-left" onSubmit={handleLogin}>
                        <p className="error-msg form-text">{errorMsg} </p>
                        <div className="form-floating mb-2">
                            <input
                                type="email"
                                id="inputEmail"
                                className="form-control"
                                placeholder="Enter email address"
                                required
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                            />
                            <label htmlFor="inputEmail">Email</label>
                        </div>

                        <div className="form-floating mb-4">
                            <input
                                type="password"
                                id="inputPassword"
                                className="form-control"
                                placeholder="Enter password"
                                required
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                            />
                            <label htmlFor="inputPassword">Password</label>
                        </div>
                        <div>
                            <button type="submit" className="btn btn-warning col-12">
                                Log in
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer className="fixed-bottom" />
        </div>
    );
};

export default Login;
