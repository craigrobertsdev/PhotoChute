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
  mutation addUser(
  $username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_PHOTO = gql`
  mutation savePhoto(
    $fileName: String!
    $url: String!
    $fileSize: Int!
    $owner: ID!
  ) {
    savePhoto(
      fileName: $fileName
      url: $url
      fileSize: $fileSize
      owner: $owner
    ) {
      _id
      username
    }
  }
`;

export const ADD_PHOTO = gql`
  mutation addPhotoToGroup(
    $photoId: ID!
    $groupId: ID!
  ) {
    addPhotoToGroup(
      photoId: $photoId
      groupId: $groupId
    ) {
      _id
      name
    }
  }
`;

export const REMOVE_PHOTO = gql`
  mutation removePhoto(
    $photoId: String!
  ) {
    removePhoto(
      photoId: $photoId
    ) {
      _id
      username
      photos {
        _id
        fileName
        url
        uploadDate
        fileSize
        group
        owner
      }
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
