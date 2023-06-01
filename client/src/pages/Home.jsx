import React from "react";
import { Link } from "react-router-dom";
import HomeImage from "../assets/images/home-image.jpg";
import HomeImageSm from "../assets/images/home-image-sm.jpg";

const Home = () => {
  return (
    <div className="body row mx-4 home-grid">
      <div className="col">
        <div className="imageCont">
          <img className="img img-lg" src={HomeImage}></img>
          <img className="img img-sm" src={HomeImageSm}></img>
        </div>
      </div>
      <div className="homeCol1 col">
        <h2 className="getter">Welcome to PhotoChute</h2>
        <p className="tagline">Connect with friends through your favourite memories!</p>
        <Link className="homeJoin m-2" to="/signup">
          Join Now!
        </Link>
      </div>
    </div>
  );
};

export default Home;
