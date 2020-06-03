/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'
import '../stylesheets/NavBar.css'

const NavBar = ({fixedTop}) => {
	let baseClassName = 'navbar navbar-expand-md justify-content-center'
	return (
		<div className={fixedTop ? baseClassName + ' fixed-top' : baseClassName}>
			<Link className="home-link" to="/">Bundo!</Link>
		</div>
	)
}

export default NavBar