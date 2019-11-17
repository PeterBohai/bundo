import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../stylesheets/Register.css";
import Footer from "./Footer";
import validator from "email-validator";

let root_url = "https://bundo-reviews.herokuapp.com";
let test_url = "http://localhost:3001";

class Register extends Component {
	constructor(props){
		super(props);
		
		this.validateEmail = this.validateEmail.bind(this);
		this.validatePassword = this.validatePassword.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.onChangeFirstName = this.onChangeFirstName.bind(this);
		this.onChangeLastName = this.onChangeLastName.bind(this);
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			formErrors: {email: "", password: ""},
			emailValid: false,
			passwordValid: false,
			formValid: false
		};
	}

	componentDidMount(){
		axios.get(root_url + "/check-error")
			.then(response => {
				let formErrorValidation = this.state.formErrors;
				formErrorValidation.email = response.data.emailErrorMsg;

				this.setState({
					formErrors: formErrorValidation
				});
			});
	}

	validateEmail(value) {
		let fieldValidationErrors = this.state.formErrors;
		let emailValid = this.state.emailValid;
		
		emailValid = validator.validate(value);
		fieldValidationErrors.email = emailValid ? "" : "Please enter a valid email address";

		this.setState({
			formErrors: fieldValidationErrors,
			emailValid: emailValid,
		}, this.validateForm);
	}

	validatePassword(value) {
		let fieldValidationErrors = this.state.formErrors;
		let passwordValid = this.state.passwordValid;
		
		passwordValid = value.length >= 6;
		fieldValidationErrors.password = passwordValid ? "": "Password must be longer than 6 characters";

		this.setState({
			formErrors: fieldValidationErrors,
			passwordValid: passwordValid,
		}, this.validateForm);
	}

	validateForm() {
		this.setState({formValid: this.state.emailValid && this.state.passwordValid});
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

		this.validateEmail(event.target.value);
	}
	onChangePassword(event) {
		this.setState({
			password: event.target.value
		});

		this.validatePassword(event.target.value);
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

		axios.post(root_url + "/register", registerInfo)
			.then(function(response) {
				if (response.data.isRegistered) {
					console.log("Successfully signed up for Bundo! Please log in.");
					window.location = "/login";
				} else {
					if (response.data.error === "UserExistsError") {
						console.log("Email is already in use, please try again");
					} else {
						console.log("Could not log in, try again!");
					}
					
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
			<div className="text-center Register"> 

				<div className="header">
					<div className="navbar navbar-expand-md fixed-top justify-content-center">
						<Link className="navbar-brand" to="/">Bundo</Link>
					</div>
				</div>

				<div className="register-mid-section">

					<div className="mid-container">
						<h3 className="login-msg">Sign Up for Bundo!</h3>
						
						<form className="form-signin text-left" onSubmit={this.handleSubmit}>
							
							<label htmlFor="inputFirstName" className="sr-only">First Name</label>
							<input type="text" id="inputFirstName" className="top-input form-control" placeholder="First Name" required autoFocus value={this.state.firstName} onChange={this.onChangeFirstName} />
							
							<label htmlFor="inputLastName" className="sr-only">Last Name</label>
							<input type="text" id="inputLastName" className="bot-input form-control" placeholder="Last Name" required value={this.state.lastName} onChange={this.onChangeLastName} />
							
							<hr></hr>
							
							<div className="form-group">
								<label htmlFor="inputEmail">Email address</label>
								<input 	type="email" 
									className="form-control" id="inputEmail" placeholder="Enter email" 
									value={this.state.email} 
									onChange={this.onChangeEmail}
									required />

								{this.state.emailValid ? 
									null :
									<small 
										className="error-msg form-text">
										{this.state.formErrors.email} 
									</small>
								}
							</div>


							<div className="form-group">
								<label htmlFor="inputPassword">Password</label>
								<input 	type="password" 
									className="form-control" id="inputPassword" placeholder="Enter password" 
									value={this.state.password} 
									onChange={this.onChangePassword}
									required />

								{this.state.passwordValid ? 
									null :
									<small 
										className="error-msg form-text">
										{this.state.formErrors.password} 
									</small>
								}
							</div>

							<button 
								className="register-button btn btn-lg btn-info btn-block" type="submit" 
								disabled={!this.state.formValid}>Sign Up</button>
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