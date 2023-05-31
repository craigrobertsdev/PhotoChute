import React, { useRef } from "react";
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
  // attaches to the last element of the thumbnails array (which is where the photo that has just been uploaded is)
  const newestImage = useRef();

  // this function repeatedly attempts to load the thumbnail for the image as there is a delay between the image upload and the thumbnail creation in Azure
  const loadImage = async (url, retries = 10) => {
    if (retries === 0) return;
    newestImage.current.classList.add("loading");
    let fetchResponse = await fetch(url);
    if (fetchResponse.status === 200) {
      newestImage.current.classList.remove("loading");
      newestImage.current.src = url;
    } else {
      setTimeout(() => loadImage(url, --retries), 500);
    }
  };

  return (
    <div className="photo-grid">
      {thumbnails.map((thumbnail, index) => (
        <div className="thumbnail-container" key={"thumbnail-" + index}>
          <button
            className="thumbnail-button"
            onClick={(event) => onPhotoLoad(event, thumbnail.serialisedFileName)}>
            <img
              className="thumbnail"
              ref={index === thumbnails.length - 1 ? newestImage : null}
              src={thumbnail.thumbnailUrl + sasToken}
              crossOrigin="anonymous"
              alt="thumbnail"
              onError={async () => await loadImage(thumbnail.thumbnailUrl + sasToken)}
            />
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
      ))}
    </div>
  );
};

export default PhotoGrid;
