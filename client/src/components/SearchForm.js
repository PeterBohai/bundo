/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "../stylesheets/SearchForm.css";

const SearchForm = ({ inNavBar }) => {
    const [findDesc, setFindDesc] = useState("");
    const [findLoc, setFindLoc] = useState("");
    const history = useHistory();
    const location = useLocation();

    const handleSubmit = (event) => {
        event.preventDefault();
        const searchResultsLocation = {
            pathname: "/query/search",
            search: `?find_desc=${encodeURIComponent(findDesc)}&find_loc=${encodeURIComponent(
                findLoc
            )}`,
        };
        if (location.pathname === "/") {
            history.push(searchResultsLocation);
        } else {
            history.push(searchResultsLocation);
            window.location.reload();
        }
    };

    let btnClassName = "search-button btn btn-dark col-5 col-sm-2";
    let inputClassName = "col-md-6";
    if (inNavBar) {
        btnClassName = "col-md-2 btn btn-dark search-button-navbar";
        inputClassName = "col-md-5";
    }

    return (
        <div className={inNavBar ? "navbar-form-main" : "search-form-main"}>
            <form className={inNavBar ? "navbar-form" : "home-page-form"} onSubmit={handleSubmit}>
                <div className="row align-items-center gy-2">
                    <div className={inputClassName}>
                        <label htmlFor="inputFind" className="sr-only">
                            Find
                        </label>
                        <input
                            type="text"
                            id="inputFind"
                            className="form-control search-form"
                            placeholder='Find (Try "Gyukaku")'
                            required
                            value={findDesc}
                            onChange={({ target }) => setFindDesc(target.value)}
                        />
                    </div>

                    <div className={inputClassName}>
                        <label htmlFor="inputLocation" className="sr-only">
                            Near
                        </label>
                        <input
                            type="text"
                            id="inputLocation"
                            className="form-control search-form"
                            placeholder='Near (Try "Vancouver")'
                            required
                            value={findLoc}
                            onChange={({ target }) => setFindLoc(target.value)}
                        />
                    </div>

                    <button type="submit" className={btnClassName}>
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchForm;
