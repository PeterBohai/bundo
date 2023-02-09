import React, { useState, useEffect }from 'react'
import Footer from './Footer'
import LoginOutBtn from './LoginOutBtn'
import SignupUserBtn from './SignupUserBtn'
import SearchForm from './SearchForm'
import authService from '../services/authentication'
import '../stylesheets/Home.css'

const Home = () => {
	const [authenticated, setAuthenticated] = useState(null)
	const [user, setUser] = useState({})

	useEffect(() => {
		authService.authenticated().then(isValid => {
			setAuthenticated(isValid)
			if (isValid) {
				setUser(JSON.parse(window.localStorage.getItem('currentBundoUser')))
			}	
		})
	}, [])

	return (
		<div className="home-page text-right">
			<div className="search-and-nav">
				<nav className="nav-section container pr-5">
					<LoginOutBtn authenticated={authenticated} />
					<SignupUserBtn authenticated={authenticated} userInfo={user} />
				</nav>
				
				<div className="front-content text-center container">
					<h1 className="display-3 main-title">Bundo!</h1>
					<SearchForm inNavBar={false}/>
				</div>
			</div>
			
			<div className="about-us text-left container">
				<h1 className="about-us-subtitle text-center">About Bundo!</h1>
				<p className="lead">
					Bundo is the new way to find more reliable and accurate ratings for any kind of business! By bundling data from trusted, popular crowd-sourced review sites such as Yelp, Google, or Facebook, you can see at a glance how a business is rated on all these platforms. It&apos;s the best of many worlds in <strong>ONE</strong> convenient place. What are you waiting for? Start <strong>BUNDO</strong>ing!
				</p>	
			</div>
			<Footer />
		</div>
	)
}

export default Home