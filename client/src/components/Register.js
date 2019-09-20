import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import request from "request";
import "./Register.css";
import bunnyIcon from "../images/bunnyicon.png";
import { GoogleLoginButton } from "react-social-login-buttons";

class Register extends Component {
	constructor(props){
		super(props);
		
		this.onChangeFirstName = this.onChangeFirstName.bind(this);
		this.onChangeLastName = this.onChangeLastName.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleGoogleLogin = this.handleGoogleLogin.bind(this);

		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			password: ""
		};
	}

	onChangeFirstName(event) {
		this.setState({
			firstName: event.target.value
		});
	}
	onChangeLastName(event) {
		this.setState({
			lastName: event.target.value
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

		const registerInfo = {
			firstName: this.state.firstName,
			lastName: this.state.lastName,
			email: this.state.email,
			password: this.state.password
		};

		console.table(registerInfo);

		axios.post("http://localhost:3001/register", registerInfo)
			.then(res => console.log(res.data));

		window.location = "/";
		
	}

	handleGoogleLogin(event) {
		request.get("http://localhost:3001/auth/google")
			.on("response", function(response){
				console.log(response.statusCode);
			});
	}

	render() {
		return (
			<div className="text-center Register"> 
				<h3>Bundo</h3>

				<GoogleLoginButton onClick={this.handleGoogleLogin} />

				<form className="form-signin" onSubmit={this.handleSubmit}>
					<img className="mb-4" src={bunnyIcon} alt="" width="72" height="72" />

					<h1 className="h3 mb-3 font-weight-normal">Register for Bundo!</h1>
					
					<label htmlFor="inputFirstName" className="sr-only">First Name</label>
					<input type="text" id="inputFirstName" className="form-control" placeholder="First Name" required autoFocus value={this.state.firstName} onChange={this.onChangeFirstName} />
					
					<label htmlFor="inputLastName" className="sr-only">Last Name</label>
					<input type="text" id="inputLastName" className="form-control" placeholder="Last Name" required value={this.state.lastName} onChange={this.onChangeLastName} />
					
					<label htmlFor="inputEmail" className="sr-only">Email</label>
					<input type="email" id="inputEmail" className="form-control" placeholder="Email" required value={this.state.email} onChange={this.onChangeEmail} />
					
					<label htmlFor="inputPassword" className="sr-only">Password</label>
					<input type="password" id="inputPassword" className="form-control" placeholder="Password" required value={this.state.password} onChange={this.onChangePassword} />
					
					<button className="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
				</form>


				<Link to="/">Home</Link>
			</div>
		);
	}
}

export default Register;