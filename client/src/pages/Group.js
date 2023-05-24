import React, { useState, useEffect } from "react";
import { DELETE_SINGLE_PHOTO, DELETE_MANY_PHOTOS } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const Group = (groupName) => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [deleteSinglePhoto] = useMutation(DELETE_SINGLE_PHOTO);
  const [deleteManyPhotos] = useMutation(DELETE_MANY_PHOTOS);

  const groupNameRegex = /^[a-zA-Z0-9]+{3-20}$/; // can only contain letters or numbers and must be between 3 and 20 characters long
  useEffect();

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
      selectedPhotos.length === 1 ? deleteSinglePhoto(photos[0]) : deleteManyPhotos(photos);
  };
  return <div></div>;
};

export default Group;
