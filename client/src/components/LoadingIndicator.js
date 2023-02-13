import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import PropagateLoader from "react-spinners/PropagateLoader";
import "./LoadingIndicator.css";

const LoadingIndicator = () => {
    const { promiseInProgress } = usePromiseTracker();
    return (
        promiseInProgress && (
            <div className="loader-spinner">
                <PropagateLoader sizeUnit={"px"} size={15} color={"#FF9F1C"} />
            </div>
        )
    );
};

export default LoadingIndicator;
