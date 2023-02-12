/* eslint-disable react/prop-types */
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "../stylesheets/SignupUserBtn.css";

const SignupUserBtn = ({ authenticated, userInfo, simpleDesign = false }) => {
    const history = useHistory();

    let className = simpleDesign ? "simple-navlink nav-link" : "signup-user";
    if (authenticated === null) {
        className += " hidden";
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
        <Link
            className={className}
            to="/register"
            style={
                simpleDesign
                    ? { textDecoration: "underline", textDecorationThickness: "2px" }
                    : null
            }
        >
            Sign up
        </Link>
    );
};

export default SignupUserBtn;
