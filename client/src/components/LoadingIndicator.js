import React from 'react'
import { usePromiseTracker } from 'react-promise-tracker'
import PropagateLoader from 'react-spinners/PropagateLoader'
import '../stylesheets/LoadingIndicator.css'

const LoadingIndicator = () => {
	
	const { promiseInProgress } = usePromiseTracker()
	return (
		promiseInProgress &&
		<div className="loader-spinner">
			<PropagateLoader sizeUnit={'px'} size={15} color={'#00adb5'}/>
		</div> 
	)
}

export default LoadingIndicator