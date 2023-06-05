import React, { useRef, useState, useEffect } from "react";
import "../assets/css/PhotoGrid.css";
import { formatDate } from "../utils/helpers";
import loadingSpinner from "../assets/images/loading.gif";

const PhotoGrid = ({
  currentUser,
  thumbnails,
  sasToken,
  onPhotoDelete,
  onPhotoLoad,
  onPhotoDownload,
  thumbnailLoading,
}) => {
  const [thumbnailCreated, setThumbnailCreated] = useState();

  useEffect(() => {
    // dummy state change to force thumbnail to be loaded when the thumbnail-loaded event is received from the server
    setThumbnailCreated(!thumbnailCreated);
  }, [thumbnailLoading]);

  // attaches to the last element of the thumbnails array (which is where the photo that has just been uploaded is)
  const newestImage = useRef();

  return (
    <div className="photo-grid">
      {thumbnails.length > 0 ? (
        thumbnails.map((thumbnail, index) => (
          <div className="thumbnail-container" key={"thumbnail-" + index}>
            <button
              className="thumbnail-button"
              onClick={(event) => onPhotoLoad(event, thumbnail.serialisedFileName)}>
              {/* {thumbnailLoading ? (
              <div className="loading"></div>
            ) : ( */}
              <img
                className="thumbnail"
                ref={index === thumbnails.length - 1 ? newestImage : null}
                src={
                  thumbnailLoading && index === thumbnails.length - 1
                    ? loadingSpinner
                    : thumbnail.thumbnailUrl + sasToken
                }
                crossOrigin="anonymous"
                alt="thumbnail"
                // onError={async () => await loadImage(thumbnail.thumbnailUrl + sasToken)}
              />
              {/* )} */}
            </button>
            <div>
              <p className="text-center">
                Uploaded by {thumbnail.owner.firstName} on {formatDate(thumbnail.uploadDate)}
              </p>
              <div className="button-row">
                <button
                  className="btn"
                  onClick={(event) => onPhotoDownload(event, thumbnail.serialisedFileName)}>
                  Download
                </button>
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
