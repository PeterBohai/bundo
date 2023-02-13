import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import "./Account.css";
import BizCard from "../components/BizCard";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import temp_pfp from "../images/bundo-profile.jpg";

const Account = () => {
    const currUser = JSON.parse(window.localStorage.getItem("currentBundoUser"));
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        bookmarks: currUser ? currUser.bookmarks : [],
    });
    const [results, setResults] = useState([]);
    const location = useLocation();
    const userid = queryString.parse(location.search).userid;

    const userDetailsHook = () => {
        axios
            .post("/api/user/details", {
                userid: userid,
            })
            .then((response) => {
                setUserInfo(response.data);
                Promise.all(
                    userInfo.bookmarks.map((biz, index) => {
                        return axios
                            .post("/api/search/details", {
                                index,
                                yelpID: biz.yelpID,
                                googleID: biz.googleID,
                                facebookID: biz.facebookID,
                            })
                            .then((bizData) => bizData.data);
                    })
                ).then((bizDataResults) => setResults(bizDataResults));
            })
            .catch((err) => console.log(err));
    };
    useEffect(userDetailsHook, []);

    // make sure Yelp internal server error (from loading too soon after bookmarking) will not crash page
    results.forEach((biz) => {
        if (biz.yelpError) {
            window.location.reload();
        }
    });

    const resultCards = results.map((biz) => {
        return <BizCard key={biz.yelpID} biz={biz} user={true} bookmarked={true} />;
    });

    return (
        <div className="account">
            <NavBar />

            <div className="account-main container-fluid">
                <div className="card profile-card">
                    <div className="card-body pfp-name">
                        <img className="profile-pic" src={temp_pfp} width="124px" alt="profile" />
                        <h2 className="profile-name">
                            {userInfo.firstName} {userInfo.lastName}
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-md-1 account-about-col">
                        <div className="card about-card">
                            <div className="card-body">
                                <h5 className="card-title about-title">
                                    About {userInfo.firstName}
                                </h5>
                                <div className="card-text">
                                    <p className="about-subtitle mb-2">Location</p>
                                    <p className="about-subtitle mb-2">Bundoing Since</p>
                                    <p className="about-subtitle mb-2">Things I love</p>
                                    <p className="about-subtitle mb-2">My Hometown</p>
                                    <p className="about-subtitle mb-2">Stats</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-1 account-bookmarks-col">
                        <div className="card bookmarks-card">
                            <div className="card-body bookmarks-card-body">
                                <p className="card-title bookmarks-title">My Bookmarks</p>
                                <div className="card-bookmark-results container-fluid">
                                    <div className="row bookmarks-row">{resultCards}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Account;
