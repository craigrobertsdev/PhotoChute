import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GET_ME } from "../utils/queries";
import { CREATE_GROUP, ADD_FRIEND, REMOVE_FRIEND, DELETE_ACCOUNT } from "../utils/mutations";
import "../assets/css/UserGroup.css";
import "../assets/css/UserPage.css";

import auth from "../utils/auth";

import { useQuery, useMutation } from "@apollo/client";

const User = () => {
  const { data } = useQuery(GET_ME);
  const [myGroups, setMyGroups] = useState([]);
  const [friendsGroups, setFriendsGroups] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (data?.me) {
      const myUpdatedGroups = data?.me?.groups?.filter((group) => group.groupOwner._id === data.me._id);
      setMyGroups(myUpdatedGroups);
      const friendsGroups = data.me.groups.filter((group) => group.groupOwner._id !== data.me._id);
      setFriendsGroups(friendsGroups);
      setFriends(data.me.friends);
    }
  }, [data]);

  const [searchInput, setSearchInput] = useState("");
  const [validationError, setValidationError] = useState(false);
  const [createGroup, { error }] = useMutation(CREATE_GROUP);
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const groupNameRegex = /^[a-zA-Z0-9]+{3-20}$/; // can only contain letters or numbers and must be between 3 and 20 characters long
  const [deleteProfile] = useMutation(DELETE_ACCOUNT);
  const userId = auth.getProfile().data._id;
  const [friendSearchError, setFriendSearchError] = useState();
  const [selectedFriend, setSelectedFriend] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createGroup({
        variables: { groupName: searchInput.trim() },
      });

      setMyGroups((prev) => [...prev, response.data.createGroup]);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
    setSearchInput("");
  };

  const [addFriend] = useMutation(ADD_FRIEND);
  const [friendInput, setFriendInput] = useState("");

  useEffect(() => {
    if (error) {
      setValidationError(true);
    }
  }, [error]);

  //function to handle addFriend mutation and input into friend search box
  const handleFriendFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const friendAdded = await addFriend({
        variables: { username: friendInput.trim() },
      });
      setFriendSearchError("");
      window.location.reload();
    } catch (err) {
      setFriendSearchError(err.message);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleDeleteUserProfile = async () => {
    await deleteProfile();
    auth.logout();
    window.location.assign("/");
  };

  const handleSelectFriend = (event, friendId) => {
    if (selectedFriend === friendId) {
      setSelectedFriend("");
    } else {
      setSelectedFriend(friendId);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const updatedUser = await removeFriend({
        variables: {
          friendId: selectedFriend,
        },
      });

      setFriends(updatedUser.data.removeFriend.friends);
      setSelectedFriend("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-page-container">
      {data && (
        <>
          <h1 className="text-center text-purple">Welcome Back {data.me.firstName}</h1>
          <div className="progress-container">
            <h4 className="text-purple">Total Photos Uploaded</h4>
            {data.me.photos.length > 0 ? (
              <ProgressBar
                now={data?.me.photos.length}
                max={data?.me.maxPhotos}
                label={`${data?.me.photos.length ? data?.me.photos.length : 0}/${
                  data?.me.maxPhotos
                }`}
                variant="photochute"
              />
            ) : (
              <h5 className="text-center">None yet!</h5>
            )}
          </div>
        </>
      )}
      <div className="flex-row justify-center mb-4">
        <div className="col-xs-12 col-sm-10 col-md-8 col-lg-6  mb-2">
          <h2 className="altHeading text-center">My Groups</h2>
          <ul className="text-center p-0 display-flex justify-center flex-wrap border bRadius p-1">
            {myGroups?.length !== undefined ? (
              myGroups?.length > 0 ? (
                myGroups.map((group) => (
                  <Link
                    key={group.serialisedGroupName}
                    to="/group"
                    state={{ groupId: group._id, serialisedGroupName: group.serialisedGroupName }}
                    className="groupName mx-2">
                    {group.name}
                  </Link>
                ))
              ) : (
                <div>Create a group and get sharing!</div>
              )
            ) : (
              <div>loading...</div>
            )}
          </ul>
        </div>
        <div className="col-xs-12 col-sm-10 col-md-8 col-lg-6 mb-2">
          <h2 className="altHeading text-center">Friends' Groups</h2>
          <ul className="text-center p-0 display-flex justify-center flex-wrap border bRadius p-1">
            {friendsGroups?.length !== undefined ? (
              friendsGroups?.length > 0 ? (
                friendsGroups.map((group) => (
                  <Link
                    key={group.serialisedGroupName}
                    to="/group"
                    state={{ groupId: group._id, serialisedGroupName: group.serialisedGroupName }}
                    className="groupName">
                    {group.name}
                  </Link>
                ))
              ) : (
                <div>Nothing to see here...</div>
              )
            ) : (
              <div>loading...</div>
            )}
          </ul>
        </div>
      </div>

      <Container className="col-xs-12 col-sm-10 col-md-8 col-lg-6 mb-2">
        <h2 className="altHeading text-center">Create a group</h2>
        <Form onSubmit={handleFormSubmit}>
          <Row className="align-items-center mb-2">
            <Col xs={12} md={9}>
              <input
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setValidationError(false)}
                type="text"
                placeholder="Enter group name"
                className="upload-input groupInput"
              />
              {validationError && error && <p className="p-1 text-center bg-danger text-white bRadius ">{error.message}</p>}
            </Col>
            <Col xs={12} md={3} className="button-container">
              <button type="submit" className="btn" disabled={validationError}>
                Create Group
              </button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Container className="col-xs-12 col-sm-10 col-md-8 col-lg-6 mb-2">
        <h2 className="altHeading text-center">My Friends</h2>
        <Row className="align-items-center mb-2">
          <Col xs={12} md={9} className="mb-2">
            <div className="members-container border bRadius">
              {friends?.length !== 0 ? (
                <ul>
                  {friends?.map((friend, index) => (
                    <div
                      key={`groupMember-${friend._id}`}
                      className={`mb-2 bRadius ${selectedFriend === friend._id ? "selected-friend" : "border"}`}
                      onClick={(event) => handleSelectFriend(event, friend._id)}>
                      <li className="px-1 m-1">
                        {friend.firstName} {friend.lastName}
                      </li>
                    </div>
                  ))}
                </ul>
              ) : (
                <div className="text-center">Add Friends Below!</div>
              )}
            </div>
          </Col>

          <Col xs={12} md={3} className="button-container">
            <button className="btn delete-button" disabled={!selectedFriend} onClick={handleRemoveFriend}>
              Remove Friend
            </button>
          </Col>
        </Row>
        <Form onSubmit={handleFriendFormSubmit}>
          <Row className="align-items-center">
            <Col xs={12} md={9}>
              <input
                placeholder="Search for a friend"
                name="friend"
                type="text"
                value={friendInput}
                onChange={(e) => setFriendInput(e.target.value)}
                onFocus={() => setFriendSearchError(false)}
                className="upload-input friendInput"
                size="lg"
              />
              {friendSearchError && <p className="p-1 text-center bg-danger text-white bRadius">{friendSearchError}</p>}
            </Col>
            <Col xs={12} md={3} className="button-container">
              <button type="submit" className="btn friendBtn">
                Add Friend
              </button>
            </Col>
          </Row>
        </Form>
      </Container>
      <div className="deleteAccDiv">
        <button className="btn bg-danger deleteAcc" onClick={handleDeleteUserProfile}>
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default User;
