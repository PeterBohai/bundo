import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import '../stylesheets/Login.css'
import Footer from './Footer'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [errorMsg, setErrorMsg] = useState(null)
	const history = useHistory()

	const handleLogin = (event) => {
		event.preventDefault()
		axios.post('/auth/login', {
			email, 
			password
		})
			.then(response => {
				console.log('Successful log in')
				const user = response.data
				window.localStorage.setItem('currentBundoUser', JSON.stringify(user)) 
				history.push({pathname: '/'})
			})
			.catch(err => {
				console.log(`Login error\n${err.response.data.error}`)
				setErrorMsg(err.response.data.error)
				setEmail('')
				setPassword('')
			})		
	}

	return (
		<div className="text-center Login">
			<div className="header">
				<div className="navbar navbar-expand-md fixed-top justify-content-center">
					<Link className="navbar-brand" to="/">Bundo</Link>
				</div>
			</div>

			<div className="login-mid-section">
				<div className="mid-container">
					<h3 className="login-msg">Log In to Bundo!</h3>
					<form className="form-signin" onSubmit={handleLogin}>
						<p className="error-msg form-text">{errorMsg} </p>
						
						<label htmlFor="inputEmail" className="sr-only">Email</label>
						<input 
							type="email" 
							id="inputEmail" 
							className="form-control" 
							placeholder="Email" required 
							value={email} 
							onChange={({ target }) => setEmail(target.value)} 
						/>
						
						<label htmlFor="inputPassword" className="sr-only">Password</label>
						<input 
							type="password" 
							id="inputPassword" 
							className="form-control"
							placeholder="Password" 
							required value={password} 
							onChange={({ target }) => setPassword(target.value)} 
						/>
						
						<button 
							type="submit"
							className="btn btn-lg btn-info btn-block login-button" 
						>
						Log in
						</button>
					</form>
				</div>
			</div>
			
			<div className="footer-section">
				<Footer />
			</div>		
		</div>
	)
}

export default Login