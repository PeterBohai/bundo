import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../stylesheets/Register.css";
import Footer from "./Footer";

class Register extends Component {
	constructor(props){
		super(props);
		
		this.onChangeFirstName = this.onChangeFirstName.bind(this);
		this.onChangeLastName = this.onChangeLastName.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

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

	render() {
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
						
						<form className="form-signin" onSubmit={this.handleSubmit}>
							
							<label htmlFor="inputFirstName" className="sr-only">First Name</label>
							<input type="text" id="inputFirstName" className="top-input form-control" placeholder="First Name" required autoFocus value={this.state.firstName} onChange={this.onChangeFirstName} />
							
							<label htmlFor="inputLastName" className="sr-only">Last Name</label>
							<input type="text" id="inputLastName" className="bot-input form-control" placeholder="Last Name" required value={this.state.lastName} onChange={this.onChangeLastName} />
							
							<label htmlFor="inputEmail" className="sr-only">Email</label>
							<input type="email" id="inputEmail" className="top-input form-control" placeholder="Email" required value={this.state.email} onChange={this.onChangeEmail} />
							
							<label htmlFor="inputPassword" className="sr-only">Password</label>
							<input type="password" id="inputPassword" className="bot-input form-control" placeholder="Password" required value={this.state.password} onChange={this.onChangePassword} />
							
							<button className="register-button btn btn-lg btn-info btn-block" type="submit">Sign Up</button>
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

export default Register;