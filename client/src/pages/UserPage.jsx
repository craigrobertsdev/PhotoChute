import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GET_ME } from "../utils/queries";
import { CREATE_GROUP, ADD_FRIEND, DELETE_ACCOUNT} from "../utils/mutations";
import "../assets/css/UserGroup.css";
import auth from "../utils/auth";




import { useQuery, useMutation } from "@apollo/client";

const User = () => {
  const { data } = useQuery(GET_ME);
  const [myGroups, setMyGroups] = useState([]);
  const [friendsGroups, setFriendsGroups] = useState([]);

  useEffect(() => {
    if (data?.me) {
      const myUpdatedGroups = data?.me?.groups?.filter(
        (group) => group.groupOwner._id === data.me._id
      );
      setMyGroups(myUpdatedGroups);
      const friendsGroups = data.me.groups.filter((group) => group.groupOwner._id !== data.me._id);
      setFriendsGroups(friendsGroups);
    }
  }, [data]);

  const [searchInput, setSearchInput] = useState("");
  const [groupDetails, setGroupDetails] = useState();
  const [validationError, setValidationError] = useState(false);
  const [createGroup] = useMutation(CREATE_GROUP);
  const groupNameRegex = /^[a-zA-Z0-9]+{3-20}$/; // can only contain letters or numbers and must be between 3 and 20 characters long
  const [deleteProfile] = useMutation(DELETE_ACCOUNT);
  const userId = auth.getProfile().data._id;



  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(searchInput);
      const response = await createGroup({
        variables: { groupName: searchInput.trim() },
      });

      console.log(response.data);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
    setSearchInput("");
    window.location.reload();
  };

  const [addFriend] = useMutation(ADD_FRIEND);
  const [friendInput, setFriendInput] = useState("");

  //function to handle addFriend mutation and input into friend search box
  const handleFriendFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const friendAdded = await addFriend({
        variables: { username: friendInput.trim() },
      })
      console.log(friendAdded)
      window.location.reload();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleDeleteUserProfile = async() => {
    await deleteProfile();
    auth.logout()
    window.location.assign("/")
  };

  const validateGroupName = (event) => {
    const value = event.target.value;

    // regex is due to limitations of azure container naming requirements
    if (!value || value.length < 3 || value.length > 30 || value.match(/--/)) {
      setValidationError(true);
    } else {
      setValidationError(false);
    }
  };
  return (
    <>
      <div className="flex-row justify-center mb-4">
        <div className="col-8">
          <h2 className="altHeading">My Groups</h2>
          <ul>
            {myGroups?.length !== undefined ? (
              myGroups.map((group) => (
                <Link
                  to="/group"
                  state={{ groupId: group._id, serialisedGroupName: group.serialisedGroupName }}
                  className="groupName"
                  >
                  {group.name}
                </Link>
              ))
            ) : (
              <div>loading...</div>
            )}
          </ul>
        </div>
        <div className="col-8">
          <h2 className="altHeading">Friends Groups</h2>
          <ul>
            {friendsGroups?.length !== undefined ? (
              friendsGroups.map((group) => (
                <Link
                  to="/group"
                  state={{ groupId: group._id, serialisedGroupName: group.serialisedGroupName }}
                  className="groupName"
                  >
                  {group.name}
                </Link>
              ))
            ) : (
              <div>loading...</div>
            )}
          </ul>
        </div>
      </div>

      <Container className="col-8">
        <h2 className="altHeading">Create a group</h2>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col xs={12} md={8}>
              <input
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                onBlur={validateGroupName}
                placeholder="Enter group name"
                className="upload-input groupInput"
              />
            </Col>
            <Col xs={12} md={4}>
              <button type="submit" className="btn" disabled={validationError && searchInput?.length !== 0}>
                Create Group
              </button>
            </Col>
          </Row>
          {validationError && (
            <p className="text-red">
              Group name must be between 3 and 30 characters long and not include consecutive '-'
              characters
            </p>
          )}
        </Form>
      </Container>

      <Container>
        <Row>
          <p>{groupDetails && groupDetails.name}</p>
        </Row>
        <Row>{groupDetails && groupDetails.members?.map((member) => <p>{member.name}</p>)}</Row>
        <Row>
          <p>{groupDetails && groupDetails.photos}</p>
        </Row>
        <Row>
          <p>{groupDetails && groupDetails.containerUrl}</p>
        </Row>
      </Container>

      <Container className="col-8">   
      <h2 className="altHeading">My Friends</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <form onSubmit={handleFriendFormSubmit}>
          <input 
            placeholder="Search for a friend" 
            name='friend'
            type='text'
            value={friendInput}
            onChange={(e) => setFriendInput(e.target.value)}
            className="upload-input friendInput"
            size="lg"
          />
          <button type='submit' className="btn friendBtn">Add a friend</button>
        </form>
      </div>
      </Container>
      <ul className="groupName">
      {data?.me.friends?.length !== undefined?(
              data.me.friends.map((friend) => (
                <li>{friend.username}</li>
              ))
            ) : (
              <div>Add Friends Above!</div>
            )}
      </ul>
      
      <div className="deleteAccDiv">
        <button className="btn bg-danger deleteAcc" onClick={handleDeleteUserProfile}>Delete Account</button>
      </div>
    </>
  );
};

export default User;
