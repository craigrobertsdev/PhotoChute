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

const PhotoGrid = ({ thumbnails, sasToken }) => {
  console.log(thumbnails);
  return (
    <div className="photo-grid">
      {thumbnails.map((thumbnail, index) => (
        <div className="thumbnail-container" key={"thumbnail-" + index}>
          <img className="thumbnail" src={thumbnail.thumbnailUrl + sasToken} alt="thumbnail" />
          <div>
            <p className="text-center">
              Uploaded by {thumbnail.owner.username} on {formatDate(thumbnail.uploadDate)}
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
