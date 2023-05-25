import React, { useState, useEffect } from "react";
import { DELETE_SINGLE_PHOTO, DELETE_MANY_PHOTOS } from "../utils/mutations";
import { GET_PHOTOS_FOR_GROUP, GET_FILE_UPLOAD_URL } from "../utils/queries";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { usePhotochuteContext } from "../utils/globalState";
import PhotoGrid from "../components/PhotoGrid";
import "../assets/css/UserGroup.css";

const Group = ({ groupName = "The Walruses" }) => {
  const {
    loading: loadingPhotos,
    error: errorLoadingPhotos,
    data: photos,
  } = useQuery(GET_PHOTOS_FOR_GROUP, {
    variables: { groupName },
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteSinglePhoto] = useMutation(DELETE_SINGLE_PHOTO);
  const [deleteManyPhotos] = useMutation(DELETE_MANY_PHOTOS);
  const groupNameRegex = /^[a-zA-Z0-9]+{3-20}$/; // can only contain letters or numbers and must be between 3 and 20 characters long

  // TODO - fetches the list of thumbnails for photos attached to this group.
  useEffect(() => {}, []);

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

  return (
    <div>
      <h1 className="text-center">{groupName}</h1>
      <div className="group-container">
        <div className="members-container">
          <h3>Members</h3>
          <p>Shae</p>
          <p>Lucien</p>
          <p>Craig</p>
        </div>
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
