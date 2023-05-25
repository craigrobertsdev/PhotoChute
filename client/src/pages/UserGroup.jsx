import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { DELETE_SINGLE_PHOTO, DELETE_MANY_PHOTOS, SAVE_PHOTO } from "../utils/mutations";
import { GET_PHOTOS_FOR_GROUP, GET_FILE_UPLOAD_URL } from "../utils/queries";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { usePhotochuteContext } from "../utils/globalState";
import uploadFileToBlob from "../utils/blobStorage";
import { useLocation } from "react-router-dom";
import PhotoGrid from "../components/PhotoGrid";
import "../assets/css/UserGroup.css";

const Group = () => {
  const location = useLocation();
  // const { name, groupOwner, members } = location.state;
  const name = "The Walruses";
  const [showModal, setShowModal] = useState(false);
  const [fileSelected, setFileSelected] = useState();
  const [uploading, setUploading] = useState(false);
  const [getFileUploadUrl] = useLazyQuery(GET_FILE_UPLOAD_URL);
  const [fileTypeValidationError, setFileTypeValidationError] = useState(false);
  const [savePhoto] = useMutation(SAVE_PHOTO);

  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */
  const groupId = "646ec77bcc84812aacaccd3e";
  const serialisedGroupName = "the-walruses-a4e50880-faa3-11ed-a777-394dc37315ec";
  const groupOwner = "";
  const members = [];

  const {
    loading: loadingPhotos,
    error: errorLoadingPhotos,
    data: photos,
  } = useQuery(GET_PHOTOS_FOR_GROUP, {
    variables: { groupName: serialisedGroupName },
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteSinglePhoto] = useMutation(DELETE_SINGLE_PHOTO);
  const [deleteManyPhotos] = useMutation(DELETE_MANY_PHOTOS);
  const groupNameRegex = /^[a-zA-Z0-9]+{3-20}$/; // can only contain letters or numbers and must be between 3 and 20 characters long

  // TODO - fetches the list of thumbnails for photos attached to this group.
  useEffect(() => {}, []);

  console.log(name, groupOwner, members);

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
    setFileSelected(event.target.files[0]);

    // validateFileType(fileSelected.type);
  };

  const onFileUpload = async () => {
    if (fileSelected && fileSelected?.name) {
      // prepare UI
      setUploading(true);
      try {
        // TODO - find a way to get the current group's containerName instead of hard coded value
        const groupName = "the-walruses-a4e50880-faa3-11ed-a777-394dc37315ec";
        const urlData = await getFileUploadUrl({
          variables: {
            groupName,
            blobName: fileSelected.name,
          },
        });

        const { fileUrl } = urlData.data.getFileUploadUrl;

        // *** UPLOAD TO AZURE STORAGE ***
        const fileUploadUrl = await uploadFileToBlob(fileSelected, fileUrl);
        console.log(fileUrl);

        // reset state/form
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
      }
      setFileSelected(null);
      setUploading(false);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div>
      <h1 className="text-center">{name}</h1>
      <div className="group-container">
        <div className="members-container">
          <h3>Owner</h3>
          <p>Craig</p>
          <h3>Members</h3>
          <p>Shae</p>
          <p>Lucien</p>
          <button className="btn" onClick={openModal}>
            Add Photos
          </button>
        </div>
        <Modal show={showModal} onHide={closeModal}>
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
        <PhotoGrid
          thumbnails={new Array(30).fill({
            fileName: "test-thumbnail.jpg",
            url: "https://picsum.photos/200",
            uploadDate: new Date(),
            fileSize: 4.3,
            owner: {
              username: "Craig",
            },
          })}
        />
      </div>
    </div>
  );
};

export default Group;
