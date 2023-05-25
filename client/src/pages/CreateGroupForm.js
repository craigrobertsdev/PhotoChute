import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { CREATE_GROUP } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const CreateGroupForm = (groupName) => {
  const [searchInput, setSearchInput] = useState("");
  const [groupDetails, setGroupDetails] = useState();
  const [createGroup] = useMutation(CREATE_GROUP);
  const navigate = useNavigate();
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(searchInput);
      const response = await createGroup({
        variables: { groupName: searchInput, userId: "646ec6c4196b0ea8624a6ead" },
      });

      console.log(response.data);
      navigate("/group", {
        state: {
          ...response,
        },
      });
      //setGroupDetails(response.data.createGroup);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
    setSearchInput("");
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
                placeholder="Enter group name"
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type="submit" variant="success" size="lg">
                Create Group
              </Button>
            </Col>
          </Row>
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
