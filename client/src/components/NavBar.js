/* eslint-disable react/prop-types */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../stylesheets/NavBar.css'
import LoginOutBtn from './LoginOutBtn'
import SignupUserBtn from './SignupUserBtn'
import SearchForm from './SearchForm'

const NavBar = ({ fixedTop, authenticated, user }) => {
	const location = useLocation()

	let baseClassName = 'bundo-navbar navbar navbar-expand-md'
	let userButtons = null
	let searchForm = null

	if (fixedTop) {
		baseClassName += ' fixed-top'
	}

	if (location.pathname === '/query/search') {
		userButtons = <div className="user-btns ml-auto">
			<LoginOutBtn authenticated={authenticated} />
			<SignupUserBtn authenticated={authenticated} userInfo={user} />
		</div>

		searchForm = 
			<SearchForm inNavBar={true} />
		
	} else {
		baseClassName += ' justify-content-center'
	}

	return (
		<div className={baseClassName}>
			<Link className="home-link" to="/">Bundo!</Link>
			{searchForm}
			{userButtons}
		</div>
	)
}

export default NavBar