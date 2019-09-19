import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

class HomePage extends Component {

	constructor(props){
		super(props);
		
		this.onChangeFind = this.onChangeFind.bind(this);
		this.onChangeNear = this.onChangeNear.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {
			findDescription: "",
			nearLocation: ""
		};
	}

	onChangeFind(event) {
		this.setState({
			findDescription: event.target.value
		});
	}

	onChangeNear(event) {
		this.setState({
			nearLocation: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		const searchInfo = {
			findDescription: this.state.findDescription,
			nearLocation: this.state.nearLocation
		};

		console.log(searchInfo);

		// Search for business near location and return top result
		// redirect with business alias as the path after /biz/
		window.location = `/biz/${searchInfo.findDescription}`;
		
	}

	render() {
		return (
			<div className="home-page text-right"> 
				<div className="masthead">
					<div className="inner">
						<nav className="nav nav-masthead justify-content-center">
							<Link className="nav-link" to="/login">Login</Link>
							<Link className="nav-link active" to="/register">Sign Up</Link>
						</nav>
					</div>
				</div>
				{/* <Link to="/biz/gyukaku-vancouver">Search gyukaku vancouver</Link> */}
				
				<div className="front-content text-center">
					<h1>Bundo!</h1>
					<form className="home-page-form" onSubmit={this.handleSubmit}>
						<div className="form-row align-items-center">
							<div className="col-sm-6">
								<label htmlFor="inputFind" className="sr-only">Find</label>
								<input type="text" id="inputFind" className="form-control" placeholder="Find" required value={this.state.findDescription} onChange={this.onChangeFind} />
							</div>

							<div className="col-sm-6">
								<label htmlFor="inputLocation" className="sr-only">Near</label>
								<input type="text" id="inputLocation" className="form-control" placeholder="Near" required value={this.state.nearLocation} onChange={this.onChangeNear} />
							</div>

							<button className="search-button btn btn-dark" type="submit">Search</button>
						</div>
						
					</form>
				</div>
				
		
			</div>
		);
	}
}

export default HomePage;