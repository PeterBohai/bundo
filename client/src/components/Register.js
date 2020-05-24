import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import IsEmail from 'isemail'
import Footer from './Footer'
import '../stylesheets/Register.css'

const Register = () => {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const history = useHistory()

	const handleRegister = (event) => {
		event.preventDefault()
		axios.post('/auth/register', {
			firstName, 
			lastName, 
			email, 
			password
		})
			.then(response => {
				console.log('Successfully registered', response.data)
				history.push({pathname: '/login'})
			})
			.catch(err => {
				console.log(`Registeration error\n${err.response.data.error}`)
				if (err.response.status === 400) {
					alert('Email already registered please log in or try again')
				}
				setEmail('')
				setPassword('')
			})		
	}

	const validatePassword = (value) => {
		return value.length >= 6
	}

	return (
		<div className="text-center Register"> 

			<div className="header">
				<div className="navbar navbar-expand-md fixed-top justify-content-center">
					<Link className="navbar-brand" to="/">Bundo</Link>
				</div>
			</div>

			<div className="register-mid-section">

				<div className="mid-container">
					<h3 className="login-msg">Sign Up for Bundo!</h3>
					<form className="form-signin text-left" onSubmit={handleRegister}>
				
						<label htmlFor="inputFirstName" className="sr-only">First Name</label>
						<input 
							type="text"
							id="inputFirstName"
							className="top-input form-control"
							placeholder="First Name" required autoFocus 
							value={firstName} 
							onChange={({ target }) => setFirstName(target.value)} 
						/>
						
						<label htmlFor="inputLastName" className="sr-only">Last Name</label>
						<input 
							type="text"
							id="inputLastName"
							className="bot-input form-control"
							placeholder="Last Name" required
							value={lastName}
							onChange={({ target }) => setLastName(target.value)} />
						
						<hr></hr>
						
						<div className="form-group">
							<label htmlFor="inputEmail">Email address</label>
							<input 	
								type="email"
								id="inputEmail"
								className="form-control"
								placeholder="Enter email"
								value={email} required
								onChange={({ target }) => setEmail(target.value)}
							/>

							{IsEmail.validate(email) ? 
								null :
								<small className="error-msg form-text">
									Please enter a valid email
								</small>
							}
						</div>

						<div className="form-group">
							<label htmlFor="inputPassword">Password</label>
							<input 	
								type="password"
								id="inputPassword" 
								className="form-control" 
								placeholder="Enter password" 
								value={password} 
								onChange={({ target }) => setPassword(target.value)}
								required />

							{validatePassword(password) ? 
								null :
								<small className="error-msg form-text">
									Password must be longer than 6 characters
								</small>
							}
						</div>

						<button 
							type="submit"
							className="register-button btn btn-lg btn-info btn-block" 
							disabled={!(validatePassword(password) && IsEmail.validate(email))}
						>
							Sign Up
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

export default Register