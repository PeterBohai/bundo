/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import "./SignUpBtn.css";

const SignUpBtn = ({ simpleDesign = false }) => {
    const className = simpleDesign ? "simple-navlink nav-link" : "signup-user";

    return (
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

export default SignUpBtn;
