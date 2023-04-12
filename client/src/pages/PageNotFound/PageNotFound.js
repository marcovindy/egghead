import React from "react";
import { Link } from "react-router-dom";
import img from '../../assets/images/404.jpg';

function PageNotFound() {
  return (
    <div>
      <h1>Page Not Found :/</h1>
      <img src={img} alt="404img" />
      
      <h3>
        Go to the Home Page: <Link to="/" className="d-flex justify-content-center"> <button className="m-4 button-perspective">Home Page</button></Link>
      </h3>
    </div>
  );
}

export default PageNotFound;
