import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import IsEmail from "isemail";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import "./Register.css";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleRegister = (event) => {
        event.preventDefault();
        axios
            .post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
            })
            .then((response) => {
                console.log("Successfully registered", response.data);
                history.push({ pathname: "/login", state: { prevPath: "/register" } });
            })
            .catch((err) => {
                console.log(`Registeration error\n${err.response.data.error}`);
                if (err.response.status === 400) {
                    alert("Email already registered please log in or try again");
                }
                setEmail("");
                setPassword("");
            });
    };

    const validatePassword = (value) => {
        return value.length >= 6;
    };

    return (
        <div className="text-center register fluid-container">
            <NavBar />

            <div className="register-main row mx-0">
                <div
                    className="col-xxl-3 col-lg-4 col-md-5 col-sm-7 col-11 mx-auto"
                    style={{ marginTop: "10rem" }}
                >
                    <h4 className="signup-subtitle">Sign up</h4>
                    <form className="form-signup text-left" onSubmit={handleRegister}>
                        <label htmlFor="inputFirstName" className="sr-only">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="input-firstname"
                            className="top-input form-control"
                            placeholder="First Name"
                            required
                            autoFocus
                            value={firstName}
                            onChange={({ target }) => setFirstName(target.value)}
                        />
                        <label htmlFor="inputLastName" className="sr-only">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="input-lastname"
                            className="bot-input form-control"
                            placeholder="Last Name"
                            required
                            value={lastName}
                            onChange={({ target }) => setLastName(target.value)}
                        />

                        <hr></hr>
                        <div className="form-floating mb-2 text-start">
                            <input
                                type="email"
                                id="inputEmail"
                                className="form-control"
                                placeholder="Enter email address"
                                value={email}
                                required
                                onChange={({ target }) => setEmail(target.value)}
                            />
                            <label htmlFor="inputEmail">Email</label>
                            {IsEmail.validate(email) ? null : (
                                <small className="error-msg form-text">
                                    Please enter a valid email
                                </small>
                            )}
                        </div>
                        <div className="form-floating mb-4 text-start">
                            <input
                                type="password"
                                id="inputPassword"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                required
                            />
                            <label htmlFor="inputPassword">Password</label>
                            {validatePassword(password) ? null : (
                                <small className="error-msg form-text">
                                    Password must be longer than 6 characters
                                </small>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-warning col-12"
                            disabled={!(validatePassword(password) && IsEmail.validate(email))}
                        >
                            Sign up
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
