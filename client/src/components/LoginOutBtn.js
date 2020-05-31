/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router-dom'
import '../stylesheets/LoginOutBtn.css'

const LoginOutBtn = ({ authenticated }) => {
	
	const className = authenticated === null ? 'loginout hidden' : 'loginout'
	
	const handleLogout = (event) => {
		event.preventDefault()
		window.localStorage.removeItem('currentBundoUser')
		window.location.reload()
	}

	return (
		authenticated 
			? <button className={className} onClick={handleLogout}>Logout</button>
			: <Link className={className} to="/login">Login</Link>
	)
}

export default LoginOutBtn