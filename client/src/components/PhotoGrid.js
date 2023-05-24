import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../assets/css/PhotoGrid.css";

/**
 * @description When called, gets a signed URL to view the requested photo
 * @param {Event} event The click event
 * @param {Number} photoId The ID of the photo to get a URL for
 */
const loadPhoto = async (event, photoId) => {
  event.preventDefault();

  //const signedUrl = await getSignedUrl(photoId);
  // console.log(signedUrl);

  // window.location.assign(signedUrl);
};

const PhotoGrid = ({ thumbnails }) => {
  return (
    <div className="photo-row">
      {thumbnails.map((thumbnail) => (
        <img src={thumbnail.url} /*{thumbnail.url}*/ alt="thumbnail" />
      ))}
    </div>
  );
};

export default PhotoGrid;
