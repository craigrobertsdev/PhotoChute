import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GET_ME } from "../utils/queries";
import { CREATE_GROUP } from "../utils/mutations";

import { useQuery, useMutation } from "@apollo/client";

const User = () => {
  const { data } = useQuery(GET_ME);
  const [myGroups, setMyGroups] = useState([]);
  const [friendsGroups, setFriendsGroups] = useState([]);
  console.log("first", data);

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
                  state={{ groupId: group._id, serialisedGroupName: group.serialisedGroupName }}>
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
                  state={{ groupId: group._id, serialisedGroupName: group.serialisedGroupName }}>
                  {group.name}
                </Link>
              ))
            ) : (
              <div>loading...</div>
            )}
          </ul>
        </div>
      </div>

      <Container>
        <h1>Create a group</h1>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col xs={12} md={8}>
              <Form.Control
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                size="lg"
                onBlur={validateGroupName}
                placeholder="Enter group name"
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type="submit" variant="success" size="lg" disabled={validationError}>
                Create Group
              </Button>
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

      <h3 className="text-center">My Friends</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
        <input placeholder="Search for a friend" />
        <button className="btn">Add a friend</button>
      </div>
      <ul>
        <li>Shae</li>
        <li>Lucien</li>
      </ul>
    </>
  );
};

export default User;
