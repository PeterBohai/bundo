import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import queryString from "query-string";
import { trackPromise } from "react-promise-tracker";
import authService from "../services/authentication";
import BizCard from "./BizCard";
import Footer from "./Footer";
import NavBar from "./NavBar";
import LoadingIndicator from "./LoadingIndicator";
import "../stylesheets/SearchResults.css";
import { useWindowSize } from "../services/hooks";

const SearchResults = () => {
    const windowSize = useWindowSize();

    const [results, setResults] = useState([]);
    const [responseError, setResponseError] = useState({
        status: null,
        statusText: "",
        noResultsError: false,
    });
    const [noResultsError, setNoResultsError] = useState(false);
    const [authenticated, setAuthenticated] = useState(null);
    const [user, setUser] = useState({
        bookmarks: [],
    });
    const location = useLocation();
    const params = queryString.parse(location.search);

    const hook = () => {
        trackPromise(
            axios
                .post("/api/search", {
                    searchDesc: params.find_desc,
                    searchLoc: params.find_loc,
                })
                .then(async (response) => {
                    const isValid = await authService.authenticated();
                    const businesses = response.data.businesses;
                    console.log(JSON.stringify(businesses));
                    setAuthenticated(isValid);
                    if (isValid) {
                        setUser(JSON.parse(window.localStorage.getItem("currentBundoUser")));
                    }
                    setResponseError({
                        status: null,
                        statusText: "",
                    });
                    setResults(businesses);
                    setNoResultsError(false);
                    if (!Array.isArray(businesses) || !businesses.length) {
                        setNoResultsError(true);
                    }
                })
                .catch((err) => {
                    setResponseError({
                        status: err.response.status,
                        statusText: err.response.statusText,
                    });
                    console.error(JSON.stringify(err.response));
                })
        );
        authService.authenticated().then((isValid) => {
            setAuthenticated(isValid);
            if (isValid) {
                setUser(JSON.parse(window.localStorage.getItem("currentBundoUser")));
            }
        });
    };
    useEffect(hook, []);

    const ErrorAlert = (
        <div className="alert alert-secondary" role="alert">
            <h4 className="alert-heading">Sorry, we could not process your request</h4>
            <p>
                There was an issue with the
                {responseError.status >= 500
                    ? " server. Please try again later. "
                    : " request. Please try a different location or business name. "}
                Thank you!
            </p>
            <hr />

            <p className="mb-0">
                {responseError.status}
                {responseError.statusText ? ` - ${responseError.statusText}` : ""}
            </p>
        </div>
    );

    const NoResultsAlert = (
        <div className="alert alert-secondary" role="alert">
            <h4 className="alert-heading">No results found</h4>
            <p>Please try a different location or business name. Thank you!</p>
        </div>
    );

    const resultCards = results.map((biz) => {
        const saved = authenticated && user.bookmarks.some((entry) => entry.yelpID === biz.yelpID);

        return (
            <BizCard key={biz.yelpID} biz={biz} authenticated={authenticated} bookmarked={saved} />
        );
    });

    return (
        <div className="search-results">
            <NavBar fixedTop={true} authenticated={authenticated} user={user} />

            <div
                className={`search-results-main container ${windowSize.width > 450 ? "px-5" : ""}`}
            >
                <div className="fw-bold fs-3 mb-4">
                    {params.find_desc}
                    <span className="fw-normal text-muted ms-2">{params.find_loc}</span>
                </div>
                <span className="fw-bold">Search results</span>
                <hr className="mb-3 mt-0 border opacity-100" />
                <LoadingIndicator />
                {responseError.status || noResultsError ? (
                    noResultsError ? (
                        NoResultsAlert
                    ) : (
                        ErrorAlert
                    )
                ) : (
                    <div className="card-results container">
                        <div className="row">{resultCards}</div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default SearchResults;
