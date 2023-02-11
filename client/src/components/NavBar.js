/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../stylesheets/NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoginOutBtn from "./LoginOutBtn";
import SignupUserBtn from "./SignupUserBtn";
import SearchForm from "./SearchForm";

const NavBar = ({ fixedTop, authenticated, user }) => {
    const location = useLocation();

    let baseClassName = "bundo-navbar navbar navbar-expand-sm py-0";
    if (fixedTop) {
        baseClassName += " fixed-top";
    }

    return (
        <div className={baseClassName}>
            <div className="container">
                <div
                    className={
                        location.pathname === "/query/search" ? "navbar-brand w-50" : "navbar-brand"
                    }
                >
                    <Link className="home-link" to="/">
                        Bundo!
                    </Link>
                </div>
                {location.pathname === "/query/search" ? (
                    <button
                        id="navbarCollapseButton"
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsingNavbar"
                        aria-controls="collapsingNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        style={{ border: "none" }}
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                ) : null}

                <div
                    className={
                        location.pathname === "/query/search"
                            ? "collapse navbar-collapse w-100"
                            : ""
                    }
                    id="collapsingNavbar"
                >
                    <ul className="navbar-nav justify-content-center w-100">
                        {location.pathname !== "/query/search" ? null : (
                            <li className="nav-item">
                                <SearchForm inNavBar={true} />
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto w-100 justify-content-end">
                        {location.pathname === "/login" ? null : (
                            <li className="nav-item">
                                <LoginOutBtn
                                    authenticated={authenticated}
                                    simpleDesign={location.pathname === "/query/search"}
                                />
                            </li>
                        )}
                        {location.pathname === "/register" ? null : (
                            <li className="nav-item">
                                <SignupUserBtn
                                    authenticated={authenticated}
                                    userInfo={user}
                                    simpleDesign={location.pathname === "/query/search"}
                                />
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
