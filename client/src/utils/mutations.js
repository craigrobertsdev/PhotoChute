import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation createGroup($groupName: String!) {
    createGroup(groupName: $groupName) {
      name
      groupOwner {
        _id
        username
        email
      }
      containerUrl
      serialisedGroupName
    }
  }
`;

export const SAVE_PHOTO = gql`
  mutation SavePhoto(
    $fileName: String!
    $url: String!
    $fileSize: Float!
    $ownerId: ID!
    $groupId: ID!
    $serialisedFileName: String!
  ) {
    savePhoto(
      fileName: $fileName
      url: $url
      fileSize: $fileSize
      ownerId: $ownerId
      groupId: $groupId
      serialisedFileName: $serialisedFileName
    ) {
      _id
      fileName
      url
    }
  }
`;

export const GET_FILE_UPLOAD_URL = gql`
  mutation getFileUploadUrl($groupName: String!) {
    getFileUploadUrl(groupName: $groupName) {
      accountName
      containerName
      sasToken
    }
  }
`;

export const DELETE_PHOTO = gql`
  mutation deleteSinglePhoto($photoId: ID!) {
    deletePhoto(photoId: $photoId) {
      _id
    }
  }
`;
