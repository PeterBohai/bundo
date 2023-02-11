/* eslint-disable react/prop-types */
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "../stylesheets/SignupUserBtn.css";

const SignupUserBtn = ({ authenticated, userInfo, simpleDesign = false }) => {
    const history = useHistory();
    let className = authenticated === null ? "signup-user hidden" : "signup-user";
    if (simpleDesign) {
        className = "simple-navlink text-decoration-underline nav-link";
    }
    const handleUser = (event) => {
        event.preventDefault();
        const userDetailsLocation = {
            pathname: "/user/details",
            search: `?userid=${userInfo.id}`,
        };
        history.push(userDetailsLocation);
    };

    return authenticated ? (
        <button className={className} onClick={handleUser}>
            {userInfo.firstName}
        </button>
    ) : (
        <Link className={className} to="/register">
            Sign up
        </Link>
    );
};

export default SignupUserBtn;
