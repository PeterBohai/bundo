import React, { Component } from "react";
import { Link } from "react-router-dom";
import { usePromiseTracker, trackPromise } from "react-promise-tracker";
import PropagateLoader from "react-spinners/PropagateLoader";
import ResultsCard from "./ResultsCard";
import axios from "axios";
import PropTypes from "prop-types";
import Footer from "./Footer";
import "../stylesheets/BizResults.css";

let root_url = "https://bundo-reviews.herokuapp.com";
let test_url = "http://localhost:3001";

function LoadingIndicator (){
	const { promiseInProgress } = usePromiseTracker();
	return (
		promiseInProgress &&
		<div className="loader-spinner">
			<PropagateLoader
				sizeUnit={"px"}
				size={15}
				color={"#00adb5"}
			/>
		</div> 
	);
}

class BizResults extends Component {
	static get propTypes() { 
		return { 
			location: PropTypes.object.isRequired
		}; 
	}

	constructor(props){
		super(props);

		this.state = {
			authenticated: false,
			findQuery: "",
			locationQuery: "",
			bizResults: []
		};

	}

	componentDidMount() {
		let findDescription = this.props.location.state.findTerm;
		let nearLocation = this.props.location.state.queryLocation;
		this.setState({findQuery: findDescription, locationQuery: nearLocation});
		
		axios.get(root_url + "/check-auth", {withCredentials: true})
			.then(response => {
				console.log(`Homepage is authenticated: ${response.data.isAuthenticated}`);
				this.setState({
					authenticated: response.data.isAuthenticated
				});
			});
		console.log("bizResults: "+ findDescription + ", " + nearLocation);
		
		trackPromise(axios.post(root_url + "/search", {
			userQueryTerm: findDescription,
			userQueryLocation: nearLocation
		})
			.then(response => {
				this.setState({bizResults: response.data.businesses});
				console.log(response.data.businesses);
			}));
		
	}

	render() {
		const resultCards = this.state.bizResults.map((biz) => <ResultsCard key={biz.yelpID} biz={biz} authenticated={this.state.authenticated} inAccountPage={false}/>);

		return (
			<div className="BizResults">
				<div className="header">
					<div className="navbar navbar-expand-md fixed-top justify-content-center">
						<Link className="navbar-brand" to="/">Bundo</Link>
					</div>
				</div>

				<div className="mid-section">
					
					<div className="jumbotron text-center page-title-content">
						<div className="container page-title-content-container">
							<h2 className="term-title">{this.state.findQuery} <p className="location-title">{ this.state.locationQuery}</p></h2>
						</div>
						<hr className="bizResults-hr"></hr>
						<LoadingIndicator />
					</div>

					<div className="fluid-container card-results">
						<div className="row">
							{resultCards}
						</div>
					</div>
					
				</div>

			</div>
		);
	}
}

export default BizResults;