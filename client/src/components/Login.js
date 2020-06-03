import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import '../stylesheets/Login.css'
import Footer from './Footer'
import NavBar from './NavBar'

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
			<NavBar fixedTop={false}/>

			<div className="login-main">
				<div className="card signup-card">
					<div className="card-body">
						<h4 className="signup-subtitle">Log in</h4>
						<form className="form-signup text-left" onSubmit={handleLogin}>
							<p className="error-msg form-text">{errorMsg} </p>
							
							<div className="form-group">
								<label htmlFor="inputEmail">Email</label>
								<input 
									type="email" 
									id="inputEmail" 
									className="form-control" 
									placeholder="Enter email address" required 
									value={email} 
									onChange={({ target }) => setEmail(target.value)} 
								/>
							</div>
							
							<div className="form-group">
								<label htmlFor="inputPassword">Password</label>
								<input 
									type="password" 
									id="inputPassword" 
									className="form-control"
									placeholder="Enter password" 
									required value={password} 
									onChange={({ target }) => setPassword(target.value)} 
								/>
							</div>
							
							<button 
								type="submit"
								className="register-button btn btn-lg btn-info btn-block login-button" 
							>
							Log in
							</button>
						</form>
					</div>
				</div>
			</div>
			
			<Footer />	
		</div>
	)
}

export default Login