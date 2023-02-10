/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../stylesheets/NavBar.css";
import LoginOutBtn from "./LoginOutBtn";
import SignupUserBtn from "./SignupUserBtn";
import SearchForm from "./SearchForm";

const NavBar = ({ fixedTop, authenticated, user }) => {
    const location = useLocation();

    let baseClassName = "bundo-navbar navbar navbar-expand-sm";
    let userButtons = null;
    let searchForm = null;

    if (fixedTop) {
        baseClassName += " fixed-top";
    }

    if (location.pathname === "/query/search") {
        userButtons = (
            <div className="ms-auto">
                <LoginOutBtn authenticated={authenticated} />
                <SignupUserBtn authenticated={authenticated} userInfo={user} />
            </div>
        );

        searchForm = <SearchForm inNavBar={true} />;
    }

    return (
        <div className={baseClassName}>
            <div className="container-fluid justify-content-center">
                <Link className="home-link" to="/">
                    Bundo!
                </Link>
                {searchForm}
                {userButtons}
            </div>
        </div>
    );
};

export default NavBar;
