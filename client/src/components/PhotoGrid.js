import React, { useRef, useState, useEffect } from "react";
import "../assets/css/PhotoGrid.css";
import { formatDate } from "../utils/helpers";

const PhotoGrid = ({ currentUser, thumbnails, sasToken, onPhotoDelete, onPhotoLoad, onPhotoDownload }) => {
  const isMobileDevice = () => {
    const mobileDevices = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

    return mobileDevices.some((device) => {
      return window.navigator.userAgent.match(device);
    });
  };

  return (
    <div className="photo-grid">
      {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          <div className="thumbnail-container" key={"thumbnail-" + index}>
            <button className="thumbnail-button" onClick={(event) => onPhotoLoad(event, thumbnail.serialisedFileName)}>
              <img className="thumbnail" src={thumbnail.thumbnailUrl + sasToken} crossOrigin="anonymous" alt="thumbnail" />
            </button>
            <div>
              <p className="text-center">
                Uploaded by {thumbnail.owner.firstName} on {formatDate(thumbnail.uploadDate)}
              </p>
              <div className="button-row">
                {!isMobileDevice() && (
                  <button className="btn" onClick={(event) => onPhotoDownload(event, thumbnail.serialisedFileName)}>
                    Download
                  </button>
                )}
                <button
                  className={`btn ${
                    thumbnail.owner._id === currentUser || // the user is the person who uploaded the photo
                    thumbnail.group.groupOwner._id === currentUser // the user is the owner of the group
                      ? ""
                      : "hidden"
                  }`}
                  onClick={(event) => onPhotoDelete(event, thumbnail)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default PhotoGrid;
