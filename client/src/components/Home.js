import React, { useState, useEffect }from 'react'
import { useHistory} from 'react-router-dom'
import Footer from './Footer'
import LoginOutBtn from './LoginOutBtn'
import SignupUserBtn from './SignupUserBtn'
import authService from '../services/authentication'
import '../stylesheets/Home.css'

const Home = () => {
	const [findDesc, setFindDesc] = useState('')
	const [findLoc, setFindLoc] = useState('')
	const [authenticated, setAuthenticated] = useState(null)
	const [user, setUser] = useState({})
	const history = useHistory()

	useEffect(() => {
		authService.authenticated().then(isValid => {
			setAuthenticated(isValid)
			if (isValid) {
				setUser(JSON.parse(window.localStorage.getItem('currentBundoUser')))
			}	
		})
	}, [])

	const handleSubmit = (event) => {
		event.preventDefault()
		const searchResultsLocation = {
			pathname: '/query/search',
			search: `?find_desc=${encodeURIComponent(findDesc)}&find_loc=${encodeURIComponent(findLoc)}`
		}
		history.push(searchResultsLocation)
	}

	return (
		<div className="home-page text-right">
			<div className="search-and-nav">
				<nav className="nav-section">
					<LoginOutBtn authenticated={authenticated} />
					<SignupUserBtn authenticated={authenticated} userInfo={user} />
				</nav>
				
				<div className="front-content text-center">
					<h1 className="display-3 main-title">Bundo!</h1>
					<form className="home-page-form" onSubmit={handleSubmit}>
						<div className="form-row align-items-center">
							<div className="col-sm-6">
								<label htmlFor="inputFind" className="sr-only">Find</label>
								<input 
									type="text" 
									id="inputFind" 
									className="form-control" 
									placeholder="Find (Try &quot;Gyukaku&quot;)" required 
									value={findDesc} 
									onChange={({ target }) => setFindDesc(target.value)} 
								/>
							</div>

							<div className="col-sm-6">
								<label htmlFor="inputLocation" className="sr-only">Near</label>
								<input 
									type="text" 
									id="inputLocation" 
									className="form-control" 
									placeholder="Near (Try &quot;Vancouver&quot;)" required 
									value={findLoc} 
									onChange={({ target }) => setFindLoc(target.value)} 
								/>
							</div>

							<button
								type="submit"
								className="search-button btn btn-dark" 
							>
									Search
							</button>
						</div>
					</form>
				</div>
			</div>
			
			<div className="about-us text-center">
				<h1 className="sub-header">About Us</h1>
				<p className="sub-paras">
					Bundo is the new way to find more reliable and accurate ratings for any kind of business! By bundling data from trusted, popular crowd-sourced review sites such as Yelp, Google, or Facebook together, you can see how a business is rated on all these platforms. Its the best of many worlds in <strong>ONE</strong> convenient place! What are you waiting for? Start <strong>BUNDO</strong>ing!
				</p>	
			</div>
			<Footer />
		</div>
	)
}

export default Home