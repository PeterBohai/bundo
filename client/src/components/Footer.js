import React from "react";
import "../stylesheets/Footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <div className="footer container-fluid">
            <div className="contact">
                <div className="contact-links">
                    <a
                        className="social-icon"
                        href="https://github.com/PeterBohai"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a
                        className="social-icon"
                        href="https://linkedin.com/in/peterbohai/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a
                        className="social-icon"
                        href="https://www.youtube.com/@PeterBohai"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon icon={faYoutube} />
                    </a>
                    <a
                        className="social-icon"
                        style={{ marginRight: 0 }}
                        href="https://twitter.com/PeterBohai"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                </div>
            </div>
            <div className="copyright">
                <span>Peter Hu © 2019-{new Date().getFullYear()}</span>
            </div>
        </div>
    );
};

export default Footer;
