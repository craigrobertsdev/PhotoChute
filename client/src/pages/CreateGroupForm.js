import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { CREATE_GROUP } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CreateGroupForm = (groupName) => {
  const [searchInput, setSearchInput] = useState("");
  const [groupDetails, setGroupDetails] = useState();
  const [validationError, setValidationError] = useState(false);
  const [createGroup] = useMutation(CREATE_GROUP);
  const navigate = useNavigate();
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
    <div>
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
    </div>
  );
};

export default CreateGroupForm;
