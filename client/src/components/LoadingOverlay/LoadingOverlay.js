import React from "react";
import './LoadingOverlay.css';
import t from "../../i18nProvider/translate";

const LoadingOverlay = ({ isLoading }) => {

    if (!isLoading) {
        return null;
    }

    return (
        <div
            className="loading loading-overlay position-fixed w-100 h-100 d-flex justify-content-center align-items-center"
        >
            <div className="spinner-border loading-spinner text-primary" role="status">
                <span className="visually-hidden">{t('Loading')}...</span>
            </div>
        </div>
    );
}
export default LoadingOverlay;
