import React from "react";
import "../assets/css/PhotoGrid.css";
import { formatDate } from "../utils/helpers";

const PhotoGrid = ({
  currentUser,
  thumbnails,
  sasToken,
  onPhotoDelete,
  onPhotoLoad,
  onPhotoDownload,
}) => {
  console.log("thumbnails", thumbnails);
  console.log(currentUser);
  return (
    <div className="photo-grid">
      {thumbnails.map((thumbnail, index) => (
        <div className="thumbnail-container" key={"thumbnail-" + index}>
          <button
            className="thumbnail-button"
            onClick={(event) => onPhotoLoad(event, thumbnail.serialisedFileName)}>
            <img className="thumbnail" src={thumbnail.thumbnailUrl + sasToken} alt="thumbnail" />
          </button>
          <div>
            <p className="text-center">
              Uploaded by {thumbnail.owner.username} on {formatDate(thumbnail.uploadDate)}
            </p>
            <div className="button-row">
              <button
                className="btn"
                onClick={(event) => onPhotoDownload(event, thumbnail.fileName)}>
                Download
              </button>
              <button
                className={`btn ${thumbnail.owner._id === currentUser ? "" : "hidden"}`}
                onClick={(event) => onPhotoDelete(event, thumbnail)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;
