import React, { useState, useEffect } from "react";
import { DELETE_SINGLE_PHOTO, DELETE_MANY_PHOTOS } from "../utils/mutations";
import { GET_PHOTOS_FOR_GROUP, GET_SIGNED_URL } from "../utils/queries";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { Container, Row, Col, Button, ToggleButton } from "react-bootstrap";

const Group = (groupName) => {
  const {
    loading: loadingPhotos,
    error: errorLoadingPhotos,
    data: photos,
  } = useQuery(GET_PHOTOS_FOR_GROUP);
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

  /**
   * @description When called, gets a signed URL to view the requested photo
   * @param {Event} event The click event
   * @param {Number} photoId The ID of the photo to get a URL for
   */
  const loadPhoto = async (event, photoId) => {
    event.preventDefault();

    //const signedUrl = await getSignedUrl(photoId);
    // console.log(signedUrl);

    // window.location.assign(signedUrl);
  };

  return (
    <div>
      {loadingPhotos ? (
        <div>Loading photos...</div>
      ) : (
        <div>
          <Container>
            <Row>
              {photos.map((photo) => (
                <Col>
                  <Button onClick={(event) => loadPhoto(event, photo._id)}>
                    <img src={photo.thumbnailUrl} alt="thumbnail" />
                  </Button>
                  <ToggleButton>Text here</ToggleButton>
                </Col>
              ))}
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Group;
