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
  mutation createGroup($groupName: String!, $userId: ID!) {
    createGroup(groupName: $groupName, userId: $userId) {
      name
      members {
        _id
        username
        email
      }
      groupOwner {
        _id
        username
        email
      }
      photos {
        _id
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
    $fileSize: Int!
    $ownerId: ID!
    $group: ID!
  ) {
    savePhoto(fileName: $fileName, url: $url, fileSize: $fileSize, owner: $owner, group: $group) {
      _id
      fileName
      url
      owner
    }
  }
`;

export const ADD_PHOTO = gql`
  mutation AddPhotoToGroup($photoId: ID!, $groupId: ID!) {
    addPhotoToGroup(photoId: $photoId, groupId: $groupId) {
      _id
      name
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

export const DELETE_SINGLE_PHOTO = gql`
  mutation deleteSinglePhoto($photoId: ID!) {
    deleteSinglePhoto(photoId: $photoId) {
      _id
    }
  }
`;

export const DELETE_MANY_PHOTOS = gql`
  mutation deleteManyPhotos($photoIds: [ID]!) {
    deleteManyPhotos(photoIds: $photoIds) {
      _id
    }
  }
`;
