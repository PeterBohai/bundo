import React from "react";
import Footer from "../components/Footer";
import SearchForm from "../components/SearchForm";
import NavBar from "../components/NavBar";
import "./Home.css";
import { useWindowSize } from "../services/hooks";

const Home = () => {
    const windowSize = useWindowSize();

    return (
        <div className="home-page text-right">
            <div className="search-and-nav">
                <NavBar />
                <div
                    className={`front-content text-center container mt-5 ${
                        windowSize.width > 450 ? "pt-5" : ""
                    }`}
                >
                    <h1 className="display-2 main-title">
                        Bundo!
                        <br />
                        <p className="fs-3 fw-light">crowd-sourced reviews at a glance</p>
                    </h1>
                    <SearchForm inNavBar={false} />
                </div>
            </div>
            <div className="about-us text-left container px-5">
                <h1 className="about-us-subtitle text-center">About Bundo!</h1>
                <p className="lead">
                    Bundo is the new way to find more reliable and accurate ratings for any kind of
                    business! By bundling data from trusted, popular crowd-sourced review sites such
                    as Yelp, Google, or Facebook, you can see at a glance how a business is rated on
                    all these platforms. It&apos;s the best of many worlds in <strong>ONE</strong>{" "}
                    convenient place. What are you waiting for? Start <strong>BUNDO</strong>ing!
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
