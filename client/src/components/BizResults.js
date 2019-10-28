import React, { Component } from "react";
import { Link } from "react-router-dom";
import ResultsCard from "./ResultsCard";
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
				this.setState({bizResults: response.data.businesses});
				console.log(response.data.businesses);
			});
	}

	render() {
		const resultCards = this.state.bizResults.map((biz) => <ResultsCard key={biz.id} biz={biz}/>)
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
					</div>

					<hr className="bizResults-hr"></hr>

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