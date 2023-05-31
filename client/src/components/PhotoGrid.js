import React, { useRef, useState } from "react";
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
  const [thumbnailLoading, setThumbnailLoading] = useState(false);

  // this function repeatedly attempts to load the thumbnail for the image as there is a delay between the image upload and the thumbnail creation in Azure. tries for 10 seconds - this should be more than enough time for the thumbnail to be generated
  const loadImage = async (url, retries = 20) => {
    if (retries === 0) {
      return;
    }
    setThumbnailLoading(true);
    newestImage.current.classList.add("loading");
    let fetchResponse = await fetch(url);
    if (fetchResponse.status === 200) {
      setThumbnailLoading(false);
      newestImage.current.classList.remove("loading");
      newestImage.current.src = url;
    } else {
      setThumbnailLoading(true);
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
            {/* {thumbnailLoading ? (
              <div className="loading"></div>
            ) : ( */}
            <img
              className="thumbnail"
              ref={index === thumbnails.length - 1 ? newestImage : null}
              src={thumbnail.thumbnailUrl + sasToken}
              crossOrigin="anonymous"
              alt="thumbnail"
              onError={async () => await loadImage(thumbnail.thumbnailUrl + sasToken)}
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
      ))}
    </div>
  );
};

export default PhotoGrid;
