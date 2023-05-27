import React, { useState, useEffect } from "react";
import { DELETE_PHOTO, SAVE_PHOTO } from "../utils/mutations";
import {
  GET_PHOTOS_FOR_GROUP,
  GET_FILE_UPLOAD_URL,
  GET_AUTHENTICATION_TOKEN,
  GET_SIGNED_URL,
} from "../utils/queries";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { sizeInMb } from "../utils/helpers";
import uploadFileToBlob from "../utils/blobStorage";
import PhotoGrid from "../components/PhotoGrid";
import "../assets/css/UserGroup.css";
import auth from "../utils/auth";
import { ProgressBar } from "react-bootstrap";

const Group = () => {
  const userId = auth.getProfile().data._id;
  const [selectedFile, setSelectedFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [fileTypeValidationError, setFileTypeValidationError] = useState(false);
  const [photoCount, setPhotoCount] = useState();
  const [maxPhotos, setMaxPhotos] = useState();
  const [uploadPaneOpen, setUploadPaneOpen] = useState(false);
  const [getFileUploadUrl] = useLazyQuery(GET_FILE_UPLOAD_URL);
  const [savePhoto] = useMutation(SAVE_PHOTO);

  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */
  const groupId = "64708396753160dc9cd92c1e";
  const serialisedGroupName = "the-walruses-5a8118b0-fbac-11ed-aaed-4bd91ebe2c21";
  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */

  const [errorMessage, setErrorMessage] = useState("");

  const [deletePhoto] = useMutation(DELETE_PHOTO);

  const { data: sasTokenData, error: tokenDataError } = useQuery(GET_AUTHENTICATION_TOKEN, {
    variables: {
      groupName: serialisedGroupName,
    },
  });

  const {
    loading: loadingPhotos,
    error: errorLoadingPhotos,
    data: photos,
  } = useQuery(GET_PHOTOS_FOR_GROUP, {
    variables: { serialisedGroupName },
  });

  if (photos) {
    console.log(photos);
  }

  const [getSignedUrl] = useLazyQuery(GET_SIGNED_URL);

  useEffect(() => {
    if (photos?.getPhotosForGroup) {
      setPhotoCount(photos.getPhotosForGroup.photos.length);
      setMaxPhotos(photos.getPhotosForGroup.maxPhotos);
    }
  }, [photos]);

  /**
   * Deletes a photo from the group's container. Only available if the user has permission to perform this action
   * @param {Event} event
   */
  const handleDeletePhoto = async (event, thumbnail) => {
    event.preventDefault();

    console.log(thumbnail);
  };

  const onFileChange = (event) => {
    // capture file into state
    setSelectedFile(event.target.files[0]);
    validateFileType(event.target.files[0].type);
  };

  function validateFileType(fileType) {
    if (fileType === "image/jpeg" || fileType === "image/jpg" || fileType === "image/png") {
      setFileTypeValidationError(false);
    } else {
      setFileTypeValidationError(true);
    }
  }

  const onFileUpload = async () => {
    if (selectedFile && selectedFile?.name) {
      // prepare UI
      setUploading(true);
      try {
        // TODO - find a way to get the current group's containerName instead of hard coded value
        const urlData = await getFileUploadUrl({
          variables: {
            serialisedGroupName,
            blobName: selectedFile.name,
          },
        });

        let { fileUrl, serialisedFileName } = urlData.data.getFileUploadUrl;
        // *** UPLOAD TO AZURE STORAGE ***
        await uploadFileToBlob(selectedFile, fileUrl);

        await savePhoto({
          variables: {
            fileName: selectedFile.name,
            url: fileUrl,
            fileSize: sizeInMb(selectedFile.size),
            ownerId: userId,
            groupId,
            serialisedFileName,
          },
        });

        // reset state/formgroup
      } catch (err) {
        console.error(err);
      }
    }
  };

  /**
   * @description When called, gets a signed URL to view the requested photo
   * @param {Event} event The click event
   * @param {Number} photoId The ID of the photo to get a URL for
   */
  const handleLoadPhoto = async (event, fileName) => {
    event.preventDefault();

    try {
      const signedUrl = await getSignedUrl({
        variables: { groupName: serialisedGroupName, fileName },
      });

      window.location.assign(signedUrl.data.getSignedUrl.fileUrl);
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  };

  const handleDownloadPhoto = async (event, fileName) => {};

  const toggleUploadPane = () => setUploadPaneOpen(!uploadPaneOpen);

  if (loadingPhotos) {
    return "Loading...";
  }

  return (
    <div>
      <div className="header-container">
        <h1 className="text-center">{photos.getPhotosForGroup.name}</h1>
        <button className="btn" onClick={toggleUploadPane}>
          Add Photos
        </button>
      </div>
      <div className="progress-container">
        <h4>Total Photos Uploaded</h4>
        <ProgressBar now={photoCount} max={maxPhotos} label={`${photoCount}/${maxPhotos}`} />
      </div>
      <div className="group-container">
        <div className={`upload-pane ${uploadPaneOpen ? "" : "hidden"}`}>
          <form className="upload-form">
            <input type="file" onChange={onFileChange} className=" upload-input" />
            <button
              className="btn"
              disabled={!selectedFile || photoCount > maxPhotos || fileTypeValidationError}
              type="submit"
              onClick={onFileUpload}>
              Upload!
            </button>
          </form>
          <div>
            {uploading && <div>Uploading</div>}
            {fileTypeValidationError && <div>File must be of type jpg, jpeg or png</div>}
          </div>
        </div>
        <div className="members-container">
          <h4>Group Owner</h4>
          <p>Craig</p>
          <h4>Members</h4>
          <p>Shae</p>
          <p>Lucien</p>
        </div>

        <PhotoGrid
          currentUser={userId}
          thumbnails={photos.getPhotosForGroup?.photos}
          sasToken={sasTokenData.getAuthenticationToken.sasToken}
          onPhotoDelete={handleDeletePhoto}
          onPhotoLoad={handleLoadPhoto}
          onPhotoDownload={handleDownloadPhoto}
        />
      </div>
    </div>
  );
};

export default Group;
