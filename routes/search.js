const searchRouter = require("express").Router();
const logger = require("../utils/logger");
const yelpFusion = require("../services/yelpFusion");
const googlePlaces = require("../services/googlePlaces");
const facebookGraph = require("../services/facebookGraph");

searchRouter.post("/", (req, res, next) => {
    const searchBody = req.body;
    let bizData = { businesses: [] };

    // make request to YELP
    yelpFusion
        .businessSearch(searchBody.searchDesc, searchBody.searchLoc, next)
        .then((yelpData) => {
            yelpData.businesses.forEach((business, index) => {
                bizData.businesses.push({
                    indexID: index + 1,
                    yelpID: business.id,
                    error: false,
                    name: business.name,
                    imageUrl: business.image_url,
                    yelpRating: business.rating,
                    yelpReviewCount: business.review_count,
                    price: business.price,
                    address: business.location.display_address,
                    phone: business.phone,
                    displayPhone: business.display_phone,
                    isOpen: business.is_closed ? "Closed" : "Open now",
                    yelpUrl: business.url,
                    latitude: business.coordinates.latitude,
                    longitude: business.coordinates.longitude,
                });
            });
            return bizData;
        })
        .then(async (filledBizData) => {
            await Promise.all(
                filledBizData.businesses.map(async (biz) => {
                    // query Google Places API (search for place_id first and then get Details data)
                    await googlePlaces
                        .placeSearch(biz.phone, "phonenumber")
                        .then((placesData) => {
                            if (placesData.status === "OK" && placesData.candidates.length >= 0) {
                                return placesData.candidates[0].place_id;
                            } else {
                                logger.error(
                                    "GOOGLE Failed to find business using phone number\n",
                                    placesData
                                );
                                logger.info(
                                    "GOOGLE Attempting to look for place_id again with business name"
                                );
                                return googlePlaces
                                    .placeSearch(biz.name, "textquery")
                                    .then((placesData) => {
                                        if (
                                            placesData.status === "OK" &&
                                            placesData.candidates.length >= 0
                                        ) {
                                            return placesData.candidates[0].place_id;
                                        } else {
                                            logger.error(
                                                "GOOGLE Failed to find business using biz name\n",
                                                placesData
                                            );
                                        }
                                    });
                            }
                        })
                        .then(async (googlePlaceId) => {
                            biz.googleID = googlePlaceId;
                            await googlePlaces
                                .placeDetail(googlePlaceId)
                                .then((detailsData) => {
                                    biz.googleRating =
                                        Math.round(detailsData.result.rating * 10) / 10;
                                    biz.googleReviewCount = detailsData.result.user_ratings_total;
                                    biz.googleUrl = detailsData.result.url;

                                    // set phone number of business if Yelp couldn't find a phone number for it
                                    if (
                                        biz.displayPhone === undefined ||
                                        biz.displayPhone.length === 0
                                    ) {
                                        biz.displayPhone =
                                            detailsData.result.formatted_phone_number;
                                    }
                                })
                                .catch((err) => {
                                    biz.googleError = err.message;
                                    logger.error(
                                        "googlePlaces.placeDetail() error recorded in biz.googleError"
                                    );
                                });
                        })
                        .catch((err) => {
                            biz.googleError = err.message;
                            logger.error(
                                "googlePlaces.placeSearch() error recorded in biz.googleError"
                            );
                        });

                    // query Facebook Grpahs API (search for id first then get Information data)
                    await facebookGraph
                        .pagesSearch(biz.name, biz.latitude, biz.longitude)
                        .then((searchData) => {
                            logger.debug(searchData.data);
                            return searchData.data[0].id;
                        })
                        .then(async (fbPlaceId) => {
                            biz.facebookID = fbPlaceId;
                            await facebookGraph
                                .placeInfo(fbPlaceId)
                                .then((infoData) => {
                                    biz.fbRating = infoData.overall_star_rating
                                        ? infoData.overall_star_rating
                                        : "N/A";
                                    biz.fbReviewCount = infoData.rating_count
                                        ? infoData.rating_count
                                        : 0;
                                    biz.fbUrl = infoData.link;
                                    logger.debug(biz);
                                })
                                .catch((err) => {
                                    biz.fbError = err.message;
                                    logger.error(
                                        "facebookGraph.placeinfo() error recorded in biz.fbError"
                                    );
                                });
                        })
                        .catch((err) => {
                            biz.fbError = err.message;
                            logger.error(
                                "facebookGraph.pagesSearch() error recorded in biz.fbError"
                            );
                        });
                })
            );

            bizData = filledBizData;
            logger.debug("Final bizData sent back (sample 1 business)", bizData.businesses[0]);
            res.json(bizData);
        });
});

searchRouter.post("/details", (req, res) => {
    const ids = req.body;
    const bizData = {};

    const fetchYelp = yelpFusion
        .businessDetailsFromId(ids.yelpID)
        .then((yelpData) => {
            (bizData.indexID = ids.index + 1),
                (bizData.yelpID = yelpData.id),
                (bizData.error = false),
                (bizData.name = yelpData.name),
                (bizData.imageUrl = yelpData.image_url),
                (bizData.yelpRating = yelpData.rating),
                (bizData.yelpReviewCount = yelpData.review_count),
                (bizData.price = yelpData.price),
                (bizData.address = yelpData.location.display_address),
                (bizData.phone = yelpData.phone),
                (bizData.displayPhone = yelpData.display_phone),
                (bizData.isOpen = yelpData.is_closed ? "Closed" : "Open now"),
                (bizData.yelpUrl = yelpData.url),
                (bizData.latitude = yelpData.coordinates.latitude),
                (bizData.longitude = yelpData.coordinates.longitude);
        })
        .catch((err) => {
            bizData.yelpError = err.message;
            logger.error("yelpFusion.businessDetailsFromId() error recorded in bizData.yelpError");
        });

    const fetchGoogle = googlePlaces
        .placeDetail(ids.googleID)
        .then((googleData) => {
            bizData.googleRating = Math.round(googleData.result.rating * 10) / 10;
            bizData.googleReviewCount = googleData.result.user_ratings_total;
            bizData.googleUrl = googleData.result.url;
            if (bizData.displayPhone === undefined || bizData.displayPhone.length === 0) {
                bizData.displayPhone = googleData.result.formatted_phone_number;
            }
        })
        .catch((err) => {
            bizData.googleError = err.message;
            logger.error("googlePlaces.placeDetail() error recorded in bizData.googleError");
        });

    const fetchFacebook = facebookGraph
        .placeInfo(ids.facebookID)
        .then((facebookData) => {
            bizData.fbRating = facebookData.overall_star_rating
                ? facebookData.overall_star_rating
                : "N/A";
            bizData.fbReviewCount = facebookData.rating_count ? facebookData.rating_count : 0;
            bizData.fbUrl = facebookData.link;
        })
        .catch((err) => {
            bizData.fbError = err.message;
            logger.error("facebookGraph.placeinfo() error recorded in bizData.fbError");
        });

    Promise.all([fetchYelp, fetchGoogle, fetchFacebook]).then(() => {
        return res.json(bizData);
    });
});

module.exports = searchRouter;
