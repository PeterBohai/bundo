import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../stylesheets/Account.css";
import Footer from "./Footer";
import ResultsCard from "./ResultsCard";
import temp_pfp from "../images/bundo-profile.jpg";

class Account extends Component {
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: "",
			authenticated: false,
			userInfo: {}
		};
	}

	componentDidMount(){
		axios.get("http://localhost:3001/check-auth")
			.then(response => {
				console.log(`User is authenticated: ${response.data.isAuthenticated}`);
				this.setState({
					authenticated: response.data.isAuthenticated
				});

				if (!response.data.isAuthenticated) {
					window.location = "/";
				} else {
					console.log("User logged in");
					axios.get("http://localhost:3001/user-info").then(
						res => {
							console.log(res.data);
							this.setState({
								userInfo: res.data
							});
							
						}
					);
				}
				
			});
		
		
	}

	render() {
		let resultCards = null;
		if (this.state.userInfo.bookmarks) {
			resultCards = this.state.userInfo.bookmarks.map((biz) => <ResultsCard key={biz.yelpID} biz={biz} isBookmark="true"/>);
		}

		let footer = null;
		console.log(this.state.userInfo.bookmarks);
		if (this.state.userInfo.bookmarks !== undefined && this.state.userInfo.bookmarks.length > 0){
			footer = <div className="footer-section">
				<Footer />
			</div>;
			console.log("here");
		} else {
			footer = <div className="footer-section-empty">
				<Footer />
			</div>;
			console.log("HERE");
		}
		
		return (
			<div className="Account">
				
				<div className="header">
					<div className="navbar navbar-expand-md justify-content-center">
						<Link className="navbar-brand" to="/">Bundo</Link>
					</div>
				</div>

				<div className="main">
					<div className="basic-profile-info jumbotron">
						<div className="container">
							<div className="profile-pic-name-container">
								<img className="profile-pic" src={temp_pfp} width="124px" alt="profile" />
								<h1 className="profile-name">{this.state.userInfo.firstName} {this.state.userInfo.lastName}</h1>
							</div>
						</div>
					</div>

					<div className="profile-content container text-center">
						<p className="bookmarks-title">Bookmarks</p>
						
						<div className="card-results">
							<div className="row">
								{resultCards}
							</div>
						</div>
					</div>
					
					
				</div>

				{footer}
				
			</div>
		);
	}
}

export default Account;