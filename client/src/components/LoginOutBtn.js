/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./LoginOutBtn.css";
import { useAuth } from "../services/hooks";

const LoginOutBtn = ({ simpleDesign = false }) => {
    const location = useLocation();
    const auth = useAuth();

    let className = simpleDesign ? "simple-navlink nav-link" : "loginout";

    return auth.user ? (
        <Link className={className} to="/logout">
            Log out
        </Link>
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
            Log in
        </Link>
    );
};

export default LoginOutBtn;
