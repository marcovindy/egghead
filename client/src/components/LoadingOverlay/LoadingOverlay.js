import React from "react";
import './LoadingOverlay.css';

const LoadingOverlay = ({ isLoading }) => {

    if (!isLoading) {
        return null;
    }

    return (
        <div
            className="loading loading-overlay position-fixed w-100 h-100 d-flex justify-content-center align-items-center"
        >
            <div className="spinner-border loading-spinner text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}
export default LoadingOverlay;
