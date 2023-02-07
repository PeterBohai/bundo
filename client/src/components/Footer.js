import React from 'react'
import '../stylesheets/Footer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
	return (
		<div className="footer container-fluid">
			<div className="contact">
				<div className="contact-links">
					<a id="github-icon" href="https://github.com/PeterBohai" target="_blank" rel="noopener noreferrer" ><FontAwesomeIcon icon={faGithubSquare} /></a>
					<a id="linkedin-icon" href="https://linkedin.com/in/peterbohai/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
				</div>
			</div>
			<div className="copyright">
				<span>Peter Hu © 2019-{new Date().getFullYear()}</span>
			</div>
		</div>
	)
}

export default Footer