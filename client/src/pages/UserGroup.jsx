import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { DELETE_SINGLE_PHOTO, DELETE_MANY_PHOTOS, SAVE_PHOTO } from "../utils/mutations";
import { GET_PHOTOS_FOR_GROUP, GET_FILE_UPLOAD_URL } from "../utils/queries";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { sizeInMb } from "../utils/helpers";
import uploadFileToBlob from "../utils/blobStorage";
import PhotoGrid from "../components/PhotoGrid";
import "../assets/css/UserGroup.css";
import auth from "../utils/auth";
import { ProgressBar } from "react-bootstrap";

const Group = () => {
  const name = "The Walruses";
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [getFileUploadUrl] = useLazyQuery(GET_FILE_UPLOAD_URL);
  const [fileTypeValidationError, setFileTypeValidationError] = useState(false);
  const [savePhoto] = useMutation(SAVE_PHOTO);
  const userId = auth.getProfile().data._id;
  const [photoCount, setPhotoCount] = useState();
  const [maxPhotos, setMaxPhotos] = useState();

  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */
  const groupId = "64708396753160dc9cd92c1e";
  const serialisedGroupName = "the-walruses-5a8118b0-fbac-11ed-aaed-4bd91ebe2c21";
  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteSinglePhoto] = useMutation(DELETE_SINGLE_PHOTO);
  const [deleteManyPhotos] = useMutation(DELETE_MANY_PHOTOS);

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

  // TODO - fetches the list of thumbnails for photos attached to this group.
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
  const deletePhoto = async (event) => {
    event.preventDefault();

    if (!selectedPhotos.length) {
      setErrorMessage("No photos selected for deletion.");
      return;
    }
    const response =
      selectedPhotos.length === 1
        ? await deleteSinglePhoto(...selectedPhotos)
        : await deleteManyPhotos(selectedPhotos);

    console.log(response);
  };

  const onFileChange = (event) => {
    // capture file into state
    setSelectedFile(event.target.files[0]);

    // validateFileType(fileSelected.type);
  };

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

        // reset state/form
        setSelectedFile(null);
        setUploading(false);
        closeModal();
        window.location.reload();
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  if (loadingPhotos) {
    return "Loading...";
  }

  return (
    <div>
      <div className="header-container">
        <h1 className="text-center">{name}</h1>
        <button className="btn" onClick={openModal}>
          Add Photos
        </button>
      </div>
      <div className="progress-container">
        <h4>Total Photos Uploaded</h4>
        <ProgressBar now={photoCount} max={maxPhotos} label={`${photoCount}/${maxPhotos}`} />
      </div>
      <div className="group-container">
        <div className="members-container">
          <h3>Owner</h3>
          <p>Craig</p>
          <h3>Members</h3>
          <p>Shae</p>
          <p>Lucien</p>
        </div>
        <Modal show={showModal} onHide={closeModal} dialogClassName="upload-modal">
          <Modal.Header closeButton>Choose a photo to upload</Modal.Header>
          <Modal.Body>
            <div>
              <input type="file" onChange={onFileChange} />
              <button
                type="submit"
                onClick={onFileUpload}
                // disabled={fileTypeValidationError}
              >
                Upload!
              </button>
            </div>
            {uploading && <div>Uploading</div>}
            {fileTypeValidationError && <div>File must be of type jpg, jpeg or png</div>}
          </Modal.Body>
        </Modal>
        <PhotoGrid thumbnails={photos.getPhotosForGroup.photos} />
      </div>
    </div>
  );
};

export default Group;
