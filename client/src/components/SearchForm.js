/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { usePlacesWidget } from "react-google-autocomplete";
import "./SearchForm.css";

const SearchForm = ({ inNavBar }) => {
    const [findDesc, setFindDesc] = useState("");
    const [findLoc, setFindLoc] = useState("");
    const history = useHistory();
    const location = useLocation();
    const { ref } = usePlacesWidget({
        apiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        onPlaceSelected: (place) => {
            setFindLoc(place.formatted_address);
        },
        options: {
            types: ["(regions)"],
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const locationVal = event.target.inputLocation.value;
        const searchResultsLocation = {
            pathname: "/query/search",
            search: `?find_desc=${encodeURIComponent(findDesc)}&find_loc=${encodeURIComponent(
                locationVal
            )}`,
        };
        if (location.pathname === "/") {
            history.push(searchResultsLocation);
        } else {
            history.push(searchResultsLocation);
            window.location.reload();
        }
    };

    return (
        <div className={inNavBar ? "navbar-form-main" : "search-form-main"}>
            <form className={inNavBar ? "navbar-form" : "home-page-form"} onSubmit={handleSubmit}>
                {inNavBar ? (
                    <div className="input-group input-group-sm">
                        <input
                            type="text"
                            id="inputFind"
                            className="form-control search-form"
                            placeholder="Find"
                            required
                            value={findDesc}
                            onChange={({ target }) => setFindDesc(target.value)}
                        />
                        <input
                            ref={ref}
                            name="inputLocation"
                            type="text"
                            id="inputLocation"
                            className="form-control search-form"
                            placeholder='Near (Try "Vancouver")'
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-dark search-button-navbar"
                            id="navbar-search-button"
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                ) : (
                    <div className="row align-items-center gy-2">
                        <div className="col-md-6">
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

                        <div className="col-md-6">
                            <label htmlFor="inputLocation" className="sr-only">
                                Near
                            </label>
                            <input
                                ref={ref}
                                name="inputLocation"
                                type="text"
                                id="inputLocation"
                                className="form-control search-form"
                                placeholder='Near (Try "Vancouver")'
                                required
                            />
                        </div>

                        <button type="submit" className="search-button btn btn-dark col-5 col-lg-2">
                            <FontAwesomeIcon icon={faSearch} /> Search
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchForm;
