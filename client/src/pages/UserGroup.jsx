import React, { useState, useEffect, useRef } from "react";
import {
  DELETE_PHOTO,
  SAVE_PHOTO,
  ADD_GROUP_MEMBERS,
  REMOVE_GROUP_MEMBERS,
  DELETE_GROUP,
} from "../utils/mutations";
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
import { useLocation } from "react-router-dom";

const Group = ({ thumbnailLoading, setThumbnailLoading }) => {
  const { groupId, serialisedGroupName } = useLocation().state;
  const userId = auth.getProfile().data._id;
  const [selectedFile, setSelectedFile] = useState();
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableFriends, setAvailableFriends] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileValidationError, setFileValidationError] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [maxPhotos, setMaxPhotos] = useState(15);
  const [userAtMaxPhotos, setUserAtMaxPhotos] = useState();
  const [uploadPaneOpen, setUploadPaneOpen] = useState(false);
  const [memberPaneOpen, setMemberPaneOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [uploadError, setUploadError] = useState(false);
  const uploadInput = useRef();
  const MAX_FILE_SIZE = 5242880; // 5MB

  // query and mutation declarations
  const [getFileUploadUrl] = useLazyQuery(GET_FILE_UPLOAD_URL);
  const [savePhoto] = useMutation(SAVE_PHOTO);
  const [deletePhoto] = useMutation(DELETE_PHOTO);
  const [addGroupMembers] = useMutation(ADD_GROUP_MEMBERS);
  const [deleteGroupMembers] = useMutation(REMOVE_GROUP_MEMBERS);
  const [deleteGroup] = useMutation(DELETE_GROUP);
  const { data: sasTokenData, error: tokenDataError } = useQuery(GET_AUTHENTICATION_TOKEN, {
    variables: {
      groupName: serialisedGroupName,
    },
  });
  const {
    loading: loadingGroup,
    error: errorLoadingGroup,
    data: group,
  } = useQuery(GET_PHOTOS_FOR_GROUP, {
    variables: { serialisedGroupName },
  });

  const [getSignedUrl] = useLazyQuery(GET_SIGNED_URL);

  useEffect(() => {
    if (group?.getPhotosForGroup) {
      setPhotos(group.getPhotosForGroup.photos);
      setPhotoCount(group.getPhotosForGroup.photos.length);
      setMaxPhotos(group.getPhotosForGroup.maxPhotos);

      // determine the current user's total photos uploaded and whether this is greater than or equal to their maximum upload count
      let userMaxPhotos, userPhotoCount;
      if (group.getPhotosForGroup.groupOwner._id === userId) {
        userMaxPhotos = group.getPhotosForGroup.groupOwner.maxPhotos;
        userPhotoCount = group.getPhotosForGroup.groupOwner.photos.length;
      } else {
        const user = group.getPhotosForGroup.members.find((member) => member._id === userId);
        userMaxPhotos = user.maxPhotos;
        userPhotoCount = user.photos.length;
      }

      setUserAtMaxPhotos(userPhotoCount >= userMaxPhotos);

      // filter out the group owner's friends who are already in the group by their id
      const groupMemberIds = group.getPhotosForGroup.members.map((member) => member._id);
      const friendsNotInGroup = group.getPhotosForGroup.groupOwner.friends.filter((friend) => {
        return !groupMemberIds.includes(friend._id);
      });
      setAvailableFriends(friendsNotInGroup);
    }
  }, [group]);

  useEffect(() => {
    if (!thumbnailLoading && uploading) {
      // window.location.reload();
      setUploading(false);
      setUploadPaneOpen(false);
    }
  }, [thumbnailLoading]);

  /**
   * Deletes a photo from the group's container. Only available if the user has permission to perform this action
   * @param {Event} event
   */
  const handleDeletePhoto = async (event, thumbnail) => {
    event.preventDefault();

    await deletePhoto({
      variables: {
        groupId,
        groupName: serialisedGroupName,
        photoId: thumbnail._id,
        serialisedGroupName,
        serialisedFileName: thumbnail.serialisedFileName,
      },
    });
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    // capture file into state
    setSelectedFile(file);
    if (event.target.files.length > 0) {
      validateFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  function validateFile(file) {
    if (
      ((file && file.type === "image/jpeg") ||
        file.type === "image/jpg" ||
        file.type === "image/png") &&
      file.size < MAX_FILE_SIZE
    ) {
      setFileValidationError(false);
    } else {
      setFileValidationError(true);
    }
  }

  const onFileUpload = async (event) => {
    event.preventDefault();
    if (!fileValidationError && selectedFile && selectedFile?.name) {
      setUploading(true);
      setUploadError(false);
      try {
        const urlData = await getFileUploadUrl({
          variables: {
            serialisedGroupName,
            blobName: selectedFile.name.toLowerCase(),
          },
        });

        let { fileUrl, serialisedFileName } = urlData.data.getFileUploadUrl;
        //  upload to Azure storage
        await uploadFileToBlob(selectedFile, fileUrl);

        await savePhoto({
          variables: {
            fileName: selectedFile.name,
            url: fileUrl,
            fileSize: sizeInMb(selectedFile.size),
            ownerId: userId,
            groupId,
            serialisedFileName,
            serialisedGroupName,
          },
        });

        // toggleUploadPane();
        setSelectedFile(null);
        uploadInput.current.value = "";
        setThumbnailLoading(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  /**
   * @description When called, gets a signed URL to view the requested photo
   * @param {Event} event The click event
   * @param {Number} photoId The ID of the photo to get a URL for
   */
  const handleLoadPhoto = async (event, serialisedFileName) => {
    event.preventDefault();

    try {
      const signedUrl = await getSignedUrl({
        variables: { groupName: serialisedGroupName, serialisedFileName },
      });

      window.location.assign(signedUrl.data.getSignedUrl.fileUrl);
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  };

  const handleDownloadPhoto = async (event, serialisedFileName) => {
    const signedUrl = await getSignedUrl({
      variables: {
        groupName: serialisedGroupName,
        serialisedFileName,
      },
    });

    fetch(signedUrl.data.getSignedUrl.fileUrl, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", "");
        a.download = serialisedFileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      });
  };

  const handleAddGroupMember = () => {
    addGroupMembers({
      variables: {
        groupId,
        memberIds: selectedFriends,
      },
    });
    setSelectedFriends([]);
  };

  const handleRemoveGroupMember = () => {
    deleteGroupMembers({
      variables: {
        groupId,
        memberIds: selectedMembers,
      },
    });
    setSelectedMembers([]);
  };

  const handleSelectFriend = (event, memberId) => {
    if (group.getPhotosForGroup.members.length + 1 === group.getPhotosForGroup.maxMembers) {
      return;
    }
    if (selectedFriends.includes(memberId)) {
      setSelectedFriends(selectedFriends.filter((member) => member !== memberId));
    } else {
      setSelectedFriends((prev) => [...prev, memberId]);
    }
    setSelectedMembers([]);
  };

  const handleSelectMember = (event, memberId) => {
    if (userId !== group.getPhotosForGroup.groupOwner._id) {
      return;
    }

    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((member) => member !== memberId));
    } else {
      setSelectedMembers((prev) => [...prev, memberId]);
    }
    setSelectedFriends([]);
  };

  const toggleUploadPane = () => {
    setMemberPaneOpen(false);
    setUploadPaneOpen(!uploadPaneOpen);
  };

  const toggleMemberPane = () => {
    setUploadPaneOpen(false);
    setMemberPaneOpen(!memberPaneOpen);
  };

  const handleDeleteGroup = async () => {
    const deletedGroup = await deleteGroup({
      variables: { groupName: serialisedGroupName },
    });

    window.location.assign("/me");
  };

  // only called when thumbnailLoading === true
  const getLoadingThumbnails = () => {
    return group?.getPhotosForGroup.photos.slice(
      0,
      group?.getPhotosForGroup.photos[group?.getPhotosForGroup.photos.length - 1]
    );
  };

  if (loadingGroup) {
    return "Loading...";
  }

  return (
    <div id="group">
      <div className="header-container">
        <h1 className="text-center">{group?.getPhotosForGroup.name}</h1>
      </div>
      {/* Button panel */}
      <div className="button-panel">
        <button className="btn" onClick={toggleUploadPane}>
          Add Photos
        </button>
        <button className={"btn"} onClick={toggleMemberPane}>
          {group.getPhotosForGroup.groupOwner._id === userId
            ? "Add/Remove Member"
            : "View Group Members"}
        </button>
        <button
          className={`btn ${group.getPhotosForGroup.groupOwner._id === userId ? "" : "hidden"}`}
          onClick={handleDeleteGroup}>
          Delete Group
        </button>
      </div>
      <div className="progress-container">
        <h4 className="text-purple">Total Photos Uploaded</h4>
        <ProgressBar
          now={photoCount}
          max={maxPhotos}
          label={`${photoCount ? photoCount : 0}/${maxPhotos}`}
          variant="photochute"
        />
      </div>
      {/* flyout pane with list of friends to add to group */}
      <div className={`add-member-pane ${memberPaneOpen ? "" : "hidden"}`}>
        <button className="btn mx-1 mb-2" onClick={toggleMemberPane}>
          Close
        </button>
        <div className="flex">
          <h4 className="text-center">Group Owner</h4>
          <div
            className={`mb-2 text-center ${
              userId === group.getPhotosForGroup.groupOwner._id ? "underline" : ""
            }`}>
            <p>
              {group.getPhotosForGroup.groupOwner.firstName}{" "}
              {group.getPhotosForGroup.groupOwner.lastName}
            </p>
          </div>
          <h4 className="text-center">
            Members{" "}
            <span className="font-small">
              {/* +1 to account for group owner  */}
              {group.getPhotosForGroup.members.length + 1}/{group.getPhotosForGroup.maxMembers}{" "}
            </span>
          </h4>
          {/* Current group members list */}
          <div className="members-container">
            <button
              className={`btn mx-1 mb-2 ${
                group.getPhotosForGroup.groupOwner._id === userId ? "" : "hidden"
              }`}
              disabled={selectedFriends.length > 0 || selectedMembers.length === 0}
              onClick={handleRemoveGroupMember}>
              Remove member from group
            </button>
            <ul>
              {group.getPhotosForGroup.members.map((member, index) => (
                <div
                  key={`groupMember-${member._id}`}
                  className={`mb-2 ${selectedMembers?.includes(member._id) ? "selected" : ""}`}
                  onClick={(event) => handleSelectMember(event, member._id)}>
                  <li>
                    {member.firstName} {member.lastName}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
        {/* List of friends who aren't currenly group members */}
        <div className={group.getPhotosForGroup.groupOwner._id === userId ? "" : "hidden"}>
          <h4 className="text-center">Available Friends</h4>
          <div className="members-container">
            <button
              className="btn mx-1 mb-2"
              onClick={handleAddGroupMember}
              disabled={
                selectedMembers.length > 0 ||
                selectedFriends.length === 0 ||
                selectedFriends.length + group.getPhotosForGroup.members.length + 1 >
                  group.getPhotosForGroup.maxMembers
              }>
              Add member to group
            </button>
            <div className="scrollable">
              <ul>
                {availableFriends.map((member, index) => (
                  <div
                    key={`selectedMember-${member._id}`}
                    className={`mb-2 ${selectedFriends?.includes(member._id) ? "selected" : ""}`}
                    onClick={(event) => handleSelectFriend(event, member._id)}>
                    <li>
                      {member.firstName} {member.lastName}
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="group-container">
        {/* pop up pane with upload photo form */}
        <div className={`upload-pane ${uploadPaneOpen ? "" : "hidden"}`}>
          <form className="upload-form">
            <input type="file" onChange={onFileChange} className="upload-input" ref={uploadInput} />
            <button
              className="btn"
              disabled={
                !selectedFile ||
                photoCount >= maxPhotos ||
                fileValidationError ||
                thumbnailLoading ||
                userAtMaxPhotos
              }
              type="submit"
              onClick={onFileUpload}>
              Upload!
            </button>
          </form>
          {userAtMaxPhotos && (
            <p>You have reached your upload capacity. Upgrade to premium to increase this limit!</p>
          )}
          <div>
            {uploading && <div>Uploading</div>}
            {fileValidationError && (
              <div>File must be of type jpg, jpeg or png and less than 5MB </div>
            )}
            {uploadError && <div>Error uploading file</div>}
          </div>
        </div>
        {group?.getPhotosForGroup?.photos.length === 0 ? (
          <h3 className="text-center text-purple no-photos">No photos yet... get sharing!</h3>
        ) : (
          <>
            <PhotoGrid
              currentUser={userId}
              thumbnails={thumbnailLoading ? getLoadingThumbnails() : photos}
              sasToken={sasTokenData.getAuthenticationToken.sasToken}
              onPhotoDelete={handleDeletePhoto}
              onPhotoLoad={handleLoadPhoto}
              onPhotoDownload={handleDownloadPhoto}
              thumbnailLoading={thumbnailLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Group;
