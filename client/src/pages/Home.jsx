import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HomeImage from '../assets/images/home-image.jpg';


const Home = () => {

  return (
    <Container>
      <div className="body">
        <Row>
          <Col>
            <div className="homeCol1">
              <h2 className="getter">Post and Share</h2>
              <p className="tagline">Connect with friends through your favourite memories!</p>
              <button className="homeJoin">Join Now!</button>
            </div>
          </Col>
          <Col>
            <img className="img" src={HomeImage}></img>
          </Col>
        </Row>
      </div>
    </Container>
  )
};

export default Home;
    