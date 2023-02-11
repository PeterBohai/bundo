/* eslint-disable react/prop-types */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../stylesheets/NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import LoginOutBtn from "./LoginOutBtn";
import SignupUserBtn from "./SignupUserBtn";
import SearchForm from "./SearchForm";

const NavBar = ({ fixedTop, authenticated, user }) => {
    const location = useLocation();

    let baseClassName = "bundo-navbar navbar navbar-expand-sm py-1";
    if (fixedTop) {
        baseClassName += " fixed-top";
    }
    if (location.pathname !== "/") {
        baseClassName += " shadow";
    }

    return (
        <div className={baseClassName}>
            <div className="container">
                <div
                    className={
                        location.pathname === "/query/search" ? "navbar-brand w-50" : "navbar-brand"
                    }
                >
                    <Link
                        className={`home-link ${location.pathname === "/" ? "invisible" : ""}`}
                        to="/"
                    >
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
                    {location.pathname !== "/query/search" ? null : (
                        <ul className="navbar-nav justify-content-center w-100">
                            <li className="nav-item">
                                <SearchForm inNavBar={true} />
                            </li>
                        </ul>
                    )}

                    {location.pathname !== "/query/search" ? (
                        <div>
                            <a
                                className="simple-navlink"
                                style={{ margin: "0.5rem" }}
                                href="https://github.com/PeterBohai/snoosdigest"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FontAwesomeIcon icon={faGithub} size="lg" />
                            </a>
                            {location.pathname === "/login" ? null : (
                                <LoginOutBtn
                                    authenticated={authenticated}
                                    simpleDesign={location.pathname === "/query/search"}
                                />
                            )}
                            {location.pathname === "/register" ? null : (
                                <SignupUserBtn
                                    authenticated={authenticated}
                                    userInfo={user}
                                    simpleDesign={location.pathname === "/query/search"}
                                />
                            )}
                        </div>
                    ) : (
                        <ul className="navbar-nav ms-auto w-100 justify-content-end my-1">
                            <li className="nav-item">
                                <a
                                    className="simple-navlink nav-link"
                                    href="https://github.com/PeterBohai/snoosdigest"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FontAwesomeIcon icon={faGithub} size="lg" />
                                </a>
                            </li>
                            <li className="nav-item">
                                <LoginOutBtn
                                    authenticated={authenticated}
                                    simpleDesign={location.pathname === "/query/search"}
                                />
                            </li>
                            <li className="nav-item">
                                <SignupUserBtn
                                    authenticated={authenticated}
                                    userInfo={user}
                                    simpleDesign={location.pathname === "/query/search"}
                                />
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavBar;
