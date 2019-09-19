import React, { Component } from "react";
import { Link } from "react-router-dom";

class BizResults extends Component {
	render() {
		return (
			<div>
				<h3>BizResults</h3>
				<p>This is the Bundo BizResults page!</p>
				<Link to="/">Home</Link>
			</div>
		);
	}
}

export default BizResults;