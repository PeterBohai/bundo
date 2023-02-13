/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import "./SignUpBtn.css";

const ProfileBtn = ({ user, simpleDesign = false }) => {
    const className = simpleDesign ? "simple-navlink nav-link" : "signup-user";

    return (
        <Link
            className={className}
            style={simpleDesign ? { textDecoration: "underline 2px" } : null}
            to={`/user/details?userid=${user.id}`}
        >
            {user.firstName}
        </Link>
    );
};

export default ProfileBtn;
