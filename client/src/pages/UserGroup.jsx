import React, { useState, useEffect } from "react";
import { DELETE_PHOTO, SAVE_PHOTO, ADD_GROUP_MEMBERS } from "../utils/mutations";
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
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [availableFriends, setAvailableFriends] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileTypeValidationError, setFileTypeValidationError] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const [maxPhotos, setMaxPhotos] = useState(15);
  const [uploadPaneOpen, setUploadPaneOpen] = useState(false);
  const [memberPaneOpen, setMemberPaneOpen] = useState(false);
  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */
  const groupId = "6472e5b7d2e3a3d54cf8319b";
  const serialisedGroupName = "the-walruses-04860d90-fd18-11ed-b68c-cf89f07a90c7";
  /* THIS IS UNTIL THE USER PROFILE PAGE IS COMPLETE */

  // query and mutation declarations
  const [getFileUploadUrl] = useLazyQuery(GET_FILE_UPLOAD_URL);
  const [savePhoto] = useMutation(SAVE_PHOTO);
  const [deletePhoto] = useMutation(DELETE_PHOTO);
  const [addGroupMembers] = useMutation(ADD_GROUP_MEMBERS);
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

  if (group) {
    console.log("group", group);
  }
  const [getSignedUrl] = useLazyQuery(GET_SIGNED_URL);

  useEffect(() => {
    if (group?.getPhotosForGroup) {
      setPhotoCount(group.getPhotosForGroup.photos.length);
      setMaxPhotos(group.getPhotosForGroup.maxPhotos);

      // filter out the group owner's friends who are already in the group by their Id
      const groupMemberIds = group.getPhotosForGroup.members.map((member) => member._id);
      //
      const friendsNotInGroup = group.getPhotosForGroup.groupOwner.friends.filter((friend) => {
        return !groupMemberIds.includes(friend._id);
      });
      setAvailableFriends(friendsNotInGroup);
    }
  }, [group]);

  /**
   * Deletes a photo from the group's container. Only available if the user has permission to perform this action
   * @param {Event} event
   */
  const handleDeletePhoto = async (event, thumbnail) => {
    event.preventDefault();

    console.log(thumbnail);

    const deletedPhotoResponse = await deletePhoto({
      variables: {
        groupName: serialisedGroupName,
        photoId: thumbnail._id,
      },
    });

    window.location.reload();

    console.log(deletedPhotoResponse);
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

  const onFileUpload = async (event) => {
    event.preventDefault();

    if (selectedFile && selectedFile?.name) {
      // prepare UI
      setUploading(true);
      try {
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
        setUploading(false);
        setSelectedFile(null);

        window.location.reload();
      } catch (err) {
        console.log(JSON.stringify(err, null, 2));
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

  const handleDownloadPhoto = async (event, fileName) => {
    const signedUrl = await getSignedUrl({
      variables: {
        groupName: serialisedGroupName,
        fileName,
      },
    });

    fetch(signedUrl.data.getSignedUrl.fileUrl, {
      method: "GET",
    })
      .then((response) => response.blob())
      .then((blob) => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      });
  };

  const handleAddGroupMember = () => {
    addGroupMembers({
      variables: {
        groupId,
        memberIds: selectedMembers,
      },
    });
  };

  const handleSelectMember = (event, memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((member) => member !== memberId));
    } else {
      setSelectedMembers((prev) => [...prev, memberId]);
    }
  };

  const toggleUploadPane = () => {
    setMemberPaneOpen(false);
    setUploadPaneOpen(!uploadPaneOpen);
  };
  const toggleMemberPane = () => {
    setUploadPaneOpen(false);
    setMemberPaneOpen(!memberPaneOpen);
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
        <button
          className={`btn ${group.getPhotosForGroup.groupOwner._id === userId ? "" : "hidden"}`}
          onClick={toggleMemberPane}>
          Add/Remove Member
        </button>
      </div>
      <div className="progress-container">
        <h4>Total Photos Uploaded</h4>
        <ProgressBar
          now={photoCount}
          max={maxPhotos}
          label={`${photoCount ? photoCount : 0}/${maxPhotos}`}
        />
      </div>
      {/* flyout pane with list of friends to add to group */}
      <div className={`add-member-pane ${memberPaneOpen ? "" : "hidden"}`}>
        <button className="btn mx-1 mb-2" onClick={handleAddGroupMember}>
          Add member to group
        </button>
        <button className="btn mx-1 mb-2" onClick={toggleMemberPane}>
          Close
        </button>
        <h4 className="text-center">Friends</h4>
        <ul>
          {availableFriends.map((member, index) => (
            <div
              key={`selectedMember-${member._id}`}
              className={`mb-2 ${selectedMembers?.includes(member._id) ? "selected" : ""}`}
              onClick={(event) => handleSelectMember(event, member._id)}>
              <li>{member.firstName}</li>
            </div>
          ))}
        </ul>
      </div>
      <div className="group-container">
        {/* pop up pane with upload photo form */}
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
          <p>{group.getPhotosForGroup.groupOwner.firstName}</p>
          <h4>Members</h4>
          {group.getPhotosForGroup.members.map((member) => (
            <p key={`member-${member._id}`}>{member.firstName}</p>
          ))}
        </div>

        <PhotoGrid
          currentUser={userId}
          thumbnails={group?.getPhotosForGroup.photos}
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
