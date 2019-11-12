import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../stylesheets/Login.css";
import Footer from "./Footer";

let root_url = "https://bundo-reviews.herokuapp.com";
// let test_url = "http://localhost:3001";

class Login extends Component {
	constructor(props){
		super(props);
		
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			email: "",
			password: "",
			formError: "" 
		};
	}

	componentDidMount(){
		axios.get(root_url + "/check-error")
			.then(response => {
				console.log("ERRROR:" + response.data.errorMsg);
				this.setState({
					formError: response.data.errorMsg
				});
			});
	}

	onChangeEmail(event) {
		this.setState({
			email: event.target.value
		});
	}

	onChangePassword(event) {
		this.setState({
			password: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		const loginInfo = {
			username: this.state.email,
			password: this.state.password
		};

		console.log(loginInfo);
		axios.post(root_url + "/login", loginInfo)
			.then(function(response) {
				if (response.data.isAuthenticated) {
					window.location = "/";
				} else {
					console.log("Could not log in, try again!");
					
					window.location.reload();
				}
			})
			.catch(function(error){
				console.log(error);
				console.log("Error while trying to log in, try again!");
				window.location.reload();
			});
		
	}

	render() {
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
						
						<form className="form-signin" onSubmit={this.handleSubmit}>
							{
								<p className="error-msg form-text">
									{this.state.formError} 
								</p>
							}
							<label htmlFor="inputEmail" className="sr-only">Email</label>
							<input type="email" id="inputEmail" className="form-control" placeholder="Email" required value={this.state.email} onChange={this.onChangeEmail} />
							
							<label htmlFor="inputPassword" className="sr-only">Password</label>
							<input type="password" id="inputPassword" className="form-control" placeholder="Password" required value={this.state.password} onChange={this.onChangePassword} />
							
							<button className="btn btn-lg btn-info btn-block login-button" type="submit">Log in</button>
						</form>
					</div>
					
				</div>
				
				<div className="footer-section">
					<Footer />
				</div>
				
			</div>
		);
	}
}

export default Login;