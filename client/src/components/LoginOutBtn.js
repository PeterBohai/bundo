/* eslint-disable react/prop-types */
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../stylesheets/LoginOutBtn.css'

const LoginOutBtn = ({ authenticated }) => {
	const location = useLocation()
	
	const className = authenticated === null ? 'loginout hidden' : 'loginout'
	
	const handleLogout = (event) => {
		event.preventDefault()
		window.localStorage.removeItem('currentBundoUser')
		window.location.reload()
	}

	return (
		authenticated 
			? <button className={className} onClick={handleLogout}>Logout</button>
			: <Link className={className} to={{
				pathname: '/login', 
				state: {
					prevPath: location.pathname
				}}}>Login</Link>
	)
}

export default LoginOutBtn