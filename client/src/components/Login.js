import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import bunnyIcon from "../images/bunnyicon.png";

class Login extends Component {
	constructor(props){
		super(props);
		
		this.onChangeEmail = this.onChangeEmail.bind(this);
		this.onChangePassword = this.onChangePassword.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			email: "",
			password: ""
		};
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
			email: this.state.email,
			password: this.state.password
		};

		console.log(loginInfo);
		window.location = "/";
		
	}

	render() {
		return (
			<div className="text-center Register"> 
				<h3>Bundo</h3>

				<form className="form-signin" onSubmit={this.handleSubmit}>
					<img className="mb-4" src={bunnyIcon} alt="" width="72" height="72" />

					<h1 className="h3 mb-3 font-weight-normal">Log In to Bundo!</h1>
					
					<label htmlFor="inputEmail" className="sr-only">Email</label>
					<input type="email" id="inputEmail" className="form-control" placeholder="Email" required value={this.state.email} onChange={this.onChangeEmail} />
					
					<label htmlFor="inputPassword" className="sr-only">Password</label>
					<input type="password" id="inputPassword" className="form-control" placeholder="Password" required value={this.state.password} onChange={this.onChangePassword} />
					
					<button className="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
				</form>

				<Link to="/">Home</Link>
			</div>
		);
	}
}

export default Login;