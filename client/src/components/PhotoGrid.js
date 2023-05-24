import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../assets/css/PhotoGrid.css";
import { formatDate } from "../utils/helpers";

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
        <div className="thumbnail-container">
          <img src={thumbnail.url} /*{thumbnail.url}*/ alt="thumbnail" />
          <div>
            <p>
              Uploaded on {formatDate(thumbnail.uploadDate)} by {thumbnail.owner.username}
            </p>
            <div className="">
              <button className="btn">Download</button>
              <button className="btn">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
