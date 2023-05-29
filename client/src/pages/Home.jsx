import React from "react";
import { Link } from "react-router-dom";
import HomeImage from "../assets/images/home-image.jpg";
import Signup from "../pages/Signup";

const Home = () => {
  return (
    <div className="body row mx-4">
      <div className="col">
        <img className="img" src={HomeImage}></img>
      </div>
      <div className="homeCol1 col">
        <h2 className="getter">Post and Share</h2>
        <p className="tagline">Connect with friends through your favourite memories!</p>
        <Link className="homeJoin m-2" to="/signup">
          Join Now!
        </Link>
      </div>
    </div>
  );
};

export default Home;
