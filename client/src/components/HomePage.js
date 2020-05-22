import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../stylesheets/HomePage.css'
import Footer from './Footer'
import PropTypes from 'prop-types'

class HomePage extends Component {
	static get propTypes() { 
		return { 
			history: PropTypes.object.isRequired,
			location: PropTypes.object.isRequired
		} 
	}

	constructor(props){
		super(props)
		
		this.onChangeFind = this.onChangeFind.bind(this)
		this.onChangeNear = this.onChangeNear.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleLogout = this.handleLogout.bind(this)

		this.state = {
			findDescription: '',
			nearLocation: '',
			authenticated: false
		}

	}

	componentDidMount(){
		axios.get('/check-auth', {withCredentials: true})
			.then(response => {
				console.log(response.data)
				
				console.log(`Homepage is authenticated: ${response.data.isAuthenticated}`)
				this.setState({
					authenticated: response.data.isAuthenticated
				})
			})
	}

	onChangeFind(event) {
		this.setState({
			findDescription: event.target.value
		})
	}

	onChangeNear(event) {
		this.setState({
			nearLocation: event.target.value
		})
	}

	handleSubmit(event) {
		event.preventDefault()

		const searchInfo = {
			findDescription: this.state.findDescription,
			nearLocation: this.state.nearLocation
		}

		console.log('serach info from Home Page: ' + JSON.stringify(searchInfo))

		const searchResultsLocation = {
			pathname: '/query/search',
			search: `?find_desc=${encodeURIComponent(this.state.findDescription)}&find_loc=${encodeURIComponent(this.state.nearLocation)}`,
			state: {findTerm: this.state.findDescription, 
				queryLocation: this.state.nearLocation}
		}
		this.props.history.push(searchResultsLocation)
		
	}

	handleLogout(event) {
		event.preventDefault()

		axios.get('/logout')
			.then(function(response) {
				if (response.data.isAuthenticated) {
					console.log('still logged in!')
					window.location.reload()
				} else {
					window.location.reload()
				}
			})
	}

	render() {

		let leftBtn = <div></div>
		let rightBtn = <div></div>

		if (this.state.authenticated) {
			leftBtn = <Link className="nav-link" to="/" onClick={this.handleLogout}>Logout</Link>
			rightBtn = <Link className="nav-link active" to="/account">Peter</Link>
		} else {
			leftBtn = <Link className="nav-link" to="/login">Login</Link>
			rightBtn = <Link className="nav-link active" to="/register">Sign Up</Link>
		}

		return (
			<div className="home-page text-right">
				<div className="search-and-nav-section">
					<div className="masthead">
						<div className="inner">
							<nav className="nav nav-masthead justify-content-center">
								{leftBtn}
								{rightBtn}
							</nav>
						</div>
					</div>
					{/* <Link to="/biz/gyukaku-vancouver">Search gyukaku vancouver</Link> */}
					
					<div className="front-content text-center">
						<h1 className="display-3 main-title">Bundo!</h1>
						<form className="home-page-form" onSubmit={this.handleSubmit}>
							<div className="form-row align-items-center">
								<div className="col-sm-6">
									<label htmlFor="inputFind" className="sr-only">Find</label>
									<input type="text" id="inputFind" className="form-control" placeholder="Find (Try &quot;Gyukaku&quot;)" required value={this.state.findDescription} onChange={this.onChangeFind} />
								</div>

								<div className="col-sm-6">
									<label htmlFor="inputLocation" className="sr-only">Near</label>
									<input type="text" id="inputLocation" className="form-control" placeholder="Near (Try &quot;Vancouver&quot;)" required value={this.state.nearLocation} onChange={this.onChangeNear} />
								</div>

								<button className="search-button btn btn-dark" type="submit">Search</button>
							</div>
						</form>
					</div>
				</div>
				
				<div className="about-us-section text-center">
					<h1 className="sub-header">About Us</h1>
					<p className="sub-paras">Bundo is the new way to find more reliable and accurate ratings for any kind of business! By bundling data from trusted, popular crowd-sourced review sites such as Yelp, Google, or Facebook together, you can see how a business is rated on all these platforms. Its the best of many worlds in <strong>ONE</strong> convenient place! What are you waiting for? Start <strong>BUNDO</strong>ing!</p>
					
				</div>
				<Footer />
			</div>
		)
	}
	
}

export default HomePage