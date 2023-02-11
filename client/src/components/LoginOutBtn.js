/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../stylesheets/LoginOutBtn.css";

const LoginOutBtn = ({ authenticated, simpleDesign = false }) => {
    const location = useLocation();

    let className = simpleDesign ? "simple-navlink nav-link" : "loginout";
    if (authenticated === null) {
        className += " hidden";
    }

    const handleLogout = (event) => {
        event.preventDefault();
        window.localStorage.removeItem("currentBundoUser");
        window.location.reload();
    };

    return authenticated ? (
        <button className={className} onClick={handleLogout}>
            Logout
        </button>
    ) : (
        <Link
            className={className}
            to={{
                pathname: "/login",
                state: {
                    prevPath: location.pathname,
                },
            }}
        >
            Login
        </Link>
    );
};

export default LoginOutBtn;
