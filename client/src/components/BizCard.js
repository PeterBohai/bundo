/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faExternalLinkAlt, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import {
    faStar as faStarReg,
    faBookmark as faBookmarkReg,
} from "@fortawesome/free-regular-svg-icons";
import "./BizCard.css";
import yelp_0 from "../images/yelp_stars/regular/regular_0.png";
import yelp_1 from "../images/yelp_stars/regular/regular_1.png";
import yelp_15 from "../images/yelp_stars/regular/regular_1_half.png";
import yelp_2 from "../images/yelp_stars/regular/regular_2.png";
import yelp_25 from "../images/yelp_stars/regular/regular_2.png";
import yelp_3 from "../images/yelp_stars/regular/regular_3.png";
import yelp_35 from "../images/yelp_stars/regular/regular_3_half.png";
import yelp_4 from "../images/yelp_stars/regular/regular_4.png";
import yelp_45 from "../images/yelp_stars/regular/regular_4_half.png";
import yelp_5 from "../images/yelp_stars/regular/regular_5.png";
import googleAttr from "../images/google/google_on_white.png";
import facebookLogo from "../images/facebook/facebook_logo.png";
import yelpLogo from "../images/yelp_logo.png";
import { useWindowSize } from "../services/hooks";
import { postBookmarkListChange } from "../services/user";

const BizCard = ({ biz, user, bookmarked }) => {
    const location = useLocation();
    const windowSize = useWindowSize();
    const [isSaved, setIsSaved] = useState(bookmarked);
    const [hovered, setHovered] = useState(false);

    const saveUnsaveHandler = (event) => {
        event.preventDefault();
        if (user) {
            const currUser = JSON.parse(window.localStorage.getItem("currentBundoUser"));

            if (!isSaved) {
                currUser.bookmarks.push({
                    yelpID: biz.yelpID,
                    googleID: biz.googleID,
                    facebookID: biz.facebookID,
                });
            } else {
                currUser.bookmarks = currUser.bookmarks.filter(
                    (entry) => entry.yelpID !== biz.yelpID
                );
            }

            // Update user bookmarks on client side
            window.localStorage.setItem("currentBundoUser", JSON.stringify(currUser));
            // Update user bookmarks in the database
            postBookmarkListChange(currUser)
                .then((response) => {
                    console.log(`Updated bookmarks in database: ${response.data.newBookmarks}`);
                    setIsSaved(!isSaved);
                    if (location.pathname.includes("/user/details")) {
                        window.location.reload();
                    }
                })
                .catch((err) => {
                    console.log(`Error updating bookmark to database: ${err.response.data.error}`);
                });
        } else {
            alert("Log in to bookmark");
        }
    };

    // different yelp ratings image
    let ratingImage = null;
    switch (biz.yelpRating) {
        case 0:
            ratingImage = <img src={yelp_0} alt="Yelp 0 stars" className="yelp-star" />;
            break;
        case 1:
            ratingImage = <img src={yelp_1} alt="Yelp 1 stars" className="yelp-star" />;
            break;
        case 1.5:
            ratingImage = <img src={yelp_15} alt="Yelp 1.5 stars" className="yelp-star" />;
            break;
        case 2:
            ratingImage = <img src={yelp_2} alt="Yelp 2 stars" className="yelp-star" />;
            break;
        case 2.5:
            ratingImage = <img src={yelp_25} alt="Yelp 2.5 stars" className="yelp-star" />;
            break;
        case 3:
            ratingImage = <img src={yelp_3} alt="Yelp 3 stars" className="yelp-star" />;
            break;
        case 3.5:
            ratingImage = <img src={yelp_35} alt="Yelp 3.5 stars" className="yelp-star" />;
            break;
        case 4:
            ratingImage = <img src={yelp_4} alt="Yelp 4 stars" className="yelp-star" />;
            break;
        case 4.5:
            ratingImage = <img src={yelp_45} alt="Yelp 4.5 stars" className="yelp-star" />;
            break;
        case 5:
            ratingImage = <img src={yelp_5} alt="Yelp 5 stars" className="yelp-star" />;
            break;
        default:
            ratingImage = <img src={yelp_0} alt="Yelp 0 stars" className="yelp-star" />;
    }

    const saveUnsaveButton = (
        <button
            className={`btn btn-${isSaved ? "danger" : "outline-danger"} save-button`}
            onClick={saveUnsaveHandler}
        >
            <FontAwesomeIcon icon={isSaved ? faBookmarkReg : faBookmarkReg} className="me-1" />
            {isSaved ? "Saved" : "Save"}
        </button>
    );

    // different google ratings
    let googleRatingImage = [];
    for (let i = 0; i < 5; i++) {
        if (i + 1 <= Math.floor(biz.googleRating)) {
            googleRatingImage.push(
                <FontAwesomeIcon icon={faStar} key={"google" + biz.yelpID + i} />
            );
        } else {
            if (i + 1 > Math.ceil(biz.googleRating)) {
                googleRatingImage.push(
                    <FontAwesomeIcon icon={faStarReg} key={"google" + biz.yelpID + i} />
                );
            } else if (biz.googleRating - Math.floor(biz.googleRating) >= 0.8) {
                googleRatingImage.push(
                    <FontAwesomeIcon icon={faStar} key={"google" + biz.yelpID + i} />
                );
            } else if (biz.googleRating - Math.floor(biz.googleRating) >= 0.3) {
                googleRatingImage.push(
                    <FontAwesomeIcon icon={faStarHalfAlt} key={"google" + biz.yelpID + i} />
                );
            } else {
                googleRatingImage.push(
                    <FontAwesomeIcon icon={faStarReg} key={"google" + biz.yelpID + i} />
                );
            }
        }
    }

    const newYelp = (
        <div className="my-1">
            <div className="review-left-col">
                <img src={yelpLogo} alt="" width="50px" />
            </div>
            <div className="d-inline-block">
                <span className="rating-score">
                    {isNaN(biz.yelpRating)
                        ? biz.yelpRating
                        : (Math.round(biz.yelpRating * 100) / 100).toFixed(1)}
                </span>
                <div className="yelp-rating-img">{ratingImage}</div>
                {windowSize.width > 450 ? (
                    <span className="review-count mx-2">({biz.yelpReviewCount})</span>
                ) : null}
                <a
                    className="external-anchor text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={biz.yelpUrl}
                >
                    {windowSize.width > 450 ? (
                        "source"
                    ) : (
                        <span className="review-count ms-2">({biz.yelpReviewCount})</span>
                    )}
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" size="sm" />
                </a>
            </div>
        </div>
    );

    const newGoogle = (
        <div className="my-1">
            <div className="review-left-col">
                <img src={googleAttr} alt="" width="55px" />
            </div>
            <div className="d-inline-block">
                <span className="rating-score">
                    {isNaN(biz.googleRating)
                        ? biz.googleRating
                        : (Math.round(biz.googleRating * 100) / 100).toFixed(1)}
                </span>
                <div className="google-rating-img">{googleRatingImage}</div>
                {windowSize.width > 450 ? (
                    <span className="review-count mx-2">({biz.googleReviewCount})</span>
                ) : null}
                <a
                    className="external-anchor text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={biz.yelpUrl}
                >
                    {windowSize.width > 450 ? (
                        "source"
                    ) : (
                        <span className="review-count ms-2">({biz.googleReviewCount})</span>
                    )}
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" size="sm" />
                </a>
            </div>
        </div>
    );

    const newFacebook = (
        <div className="my-1">
            <div className="review-left-col">
                <img src={facebookLogo} alt="" width="55px" />
            </div>
            {biz.fbError ? (
                <div className="d-inline-block">
                    <span className="rating-score facebook-rating-error">N/A</span>
                </div>
            ) : (
                <div className="d-inline-block">
                    <span
                        className={`rating-score ${
                            isNaN(biz.fbRating) ? "facebook-rating-error" : ""
                        }`}
                    >
                        {isNaN(biz.fbRating)
                            ? biz.fbRating
                            : (Math.round(biz.fbRating * 100) / 100).toFixed(1)}
                    </span>
                    {windowSize.width > 450 ? (
                        <span className="review-count mx-2">({biz.fbReviewCount})</span>
                    ) : null}
                    <a
                        className="external-anchor text-decoration-none"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={biz.yelpUrl}
                    >
                        {windowSize.width > 450 ? (
                            "source"
                        ) : (
                            <span className="review-count ms-2">({biz.fbReviewCount})</span>
                        )}
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-1" size="sm" />
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div
            className={`card px-0 shadow-sm mb-3 container-fluid bizcard-card ${
                hovered ? "" : "border-light"
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="row g-0">
                <div className="col-md-3 card-body d-flex align-items-start">
                    <img src={biz.imageUrl} className="card-img biz-img mx-auto" alt={biz.name} />
                </div>
                <div className="col-md-9">
                    <div className="card-body">
                        <h5 className="card-title fw-bolder mb-1">
                            {biz.indexID + ". " + biz.name}
                            <div className="d-inline ms-2">{saveUnsaveButton}</div>
                        </h5>
                        <div className="review-tags mb-3">
                            <span className="badge text-bg-light">{biz.price}</span>
                            <span
                                className={`badge text-bg-light ms-2 ${
                                    biz.isOpen === "Open now" ? "open-tag" : "closed-tag"
                                }`}
                            >
                                {biz.isOpen === "Open now" ? "Open" : "Closed"}
                            </span>
                        </div>
                        <div className="review-body">
                            <div className="bizcard-review-section">
                                {newYelp}
                                {newGoogle}
                                {newFacebook}
                            </div>
                            <hr className="my-2 border opacity-75" />
                            <div className="bizcard-info-section">
                                <div className="d-flex">
                                    <div className="review-left-col fw-bold">Address</div>
                                    <span className="text-muted">{biz.address.join(", ")}</span>
                                </div>
                                <div className="d-flex">
                                    <div className="review-left-col fw-bold">Phone</div>
                                    <span className="text-muted">{biz.displayPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BizCard;
