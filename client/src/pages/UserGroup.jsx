import React, { useState, useEffect } from "react";
import { DELETE_SINGLE_PHOTO, DELETE_MANY_PHOTOS } from "../utils/mutations";
import { GET_PHOTOS_FOR_GROUP, GET_FILE_UPLOAD_URL } from "../utils/queries";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Container, Row, Col, Button, ToggleButton } from "react-bootstrap";
import PhotoGrid from "../components/PhotoGrid";
import "../assets/css/UserGroup.css";
/** @typedef Group {
 *  name: String
 * } */
/**
 *
 * @param {{group: Group}}
 * @returns
 */
const Group = ({ group }) => {
  const {
    loading: loadingPhotos,
    error: errorLoadingPhotos,
    data: photos,
  } = useQuery(GET_PHOTOS_FOR_GROUP, {
    variables: { groupName: "the-walruses" },
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteSinglePhoto] = useMutation(DELETE_SINGLE_PHOTO);
  const [deleteManyPhotos] = useMutation(DELETE_MANY_PHOTOS);
  const groupNameRegex = /^[a-zA-Z0-9]+{3-20}$/; // can only contain letters or numbers and must be between 3 and 20 characters long

  // TODO - fetches the list of thumbnails for photos attached to this group.
  useEffect(() => {}, []);

  /**
   *
   * @param {Event} event the incoming event
   */
  const deletePhotos = async (event) => {
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
      <h1>{group.name}</h1>
      <div>List of all images 5x3 with scroll maybe??</div>
      <div className="grid-container">
        <PhotoGrid
          thumbnails={new Array(30).fill({
            fileName: "test-thumbnail.jpg",
            url: "https://picsum.photos/200",
            uploadDate: new Date(),
            fileSize: 4.3,
            owner: {
              username: "robbo",
            },
          })}
        />
      </div>
    </div>
  );
};

export default Group;
