import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Footer from "./Footer";
import "../stylesheets/BizResults.css";


class BizResults extends Component {
	static propTypes = {
		history: PropTypes.object.isRequired
	};

	constructor(props){
		super(props);

		this.state = {
			authenticated: false,
			findQuery: "",
			locationQuery: "",
			bizResults: []
		};

		const { match, location, history } = this.props;
	}

	componentDidMount() {
		let findDescription = this.props.location.state.findTerm;
		let nearLocation = this.props.location.state.queryLocation;
		this.setState({findQuery: findDescription, locationQuery: nearLocation});

		console.log("bizResults: "+ findDescription + ", " + nearLocation)

		axios.post("http://localhost:3001/search", {
			userQueryTerm: findDescription,
			userQueryLocation: nearLocation
		})
			.then(response => {
				console.log(response.data)
			});
	}

	render() {
		return (
			<div className="BizResults">
				<div className="header">
					<div className="navbar navbar-expand-md fixed-top justify-content-center">
						<Link className="navbar-brand" to="/">Bundo</Link>
					</div>
				</div>

				<div className="mid-section">
					
					<div class="jumbotron text-center page-title-content">
						<div class="container page-title-content-container">
							<h2 class="term-title">{this.state.findQuery} <p className="location-title">{ this.state.locationQuery}</p></h2>
						</div>
					</div>

					<hr></hr>

					<div className="container card-results">
						<div className="row">
							
							<div className="col-lg-4 col-md-6 mb-4">
								
								<div className="card shadow-sm">
									<img src="https://s3-media1.fl.yelpcdn.com/bphoto/siv49lMrhZ2ANEg-zXQn9w/o.jpg" alt="" className="card-img-top" />
									<div className="card-body">
										<h5 className="card-title">Card title</h5>
										<p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
										<Link to="#">read more</Link>
									</div>
								</div>

							</div>

							<div className="col-lg-4 col-md-6 mb-4">
								<div className="card shadow-sm">
									<img src="https://s3-media1.fl.yelpcdn.com/bphoto/siv49lMrhZ2ANEg-zXQn9w/o.jpg" alt="" className="card-img-top" />
									<div className="card-body">
										<h5 className="card-title">Card title</h5>
										<p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
										<Link to="#">read more</Link>
									</div>
								</div>
							</div>

							<div className="col-lg-4 col-md-6">

								<div className="card shadow-sm mb-4">
									<img src="https://s3-media1.fl.yelpcdn.com/bphoto/siv49lMrhZ2ANEg-zXQn9w/o.jpg" alt="" className="card-img-top" />
									<div className="card-body">
										<h5 className="card-title">Card title</h5>
										<p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
										<Link to="#">read more</Link>
									</div>
								</div>

							</div>
						</div>
					</div>
					
				</div>
				
				
				
			</div>
		);
	}
}

export default BizResults;