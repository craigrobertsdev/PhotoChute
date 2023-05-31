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

export const DELETE_GROUP = gql`
  mutation deleteGroup($groupName: String!) {
    _id
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
  mutation deleteSinglePhoto($groupName: String!, $photoId: ID!) {
    deletePhoto(groupName: $groupName, photoId: $photoId) {
      _id
    }
  }
`;

export const ADD_GROUP_MEMBERS = gql`
  mutation addGroupMembers($groupId: ID!, $memberIds: [ID]!) {
    addGroupMembers(groupId: $groupId, memberIds: $memberIds) {
      _id
      members {
        firstName
        lastName
      }
    }
  }
`;

export const REMOVE_GROUP_MEMBERS = gql`
  mutation removeGroupMembers($groupId: ID!, $memberIds: [ID]!) {
    removeGroupMembers(groupId: $groupId, memberIds: $memberIds) {
      _id
      members {
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation deleteAccount {
    deleteAccount {
      _id
    }
  }
`;

export const BUY_PREMIUM = gql`
  mutation BuyPremium($premium: Int) {
    buyPremium(premium: $premium) {
      session
    }
  }
`

export const ADD_FRIEND = gql`
  mutation addFriend($username: String) {
    addFriend(username: $username) {
      username
      _id
      firstName
      lastName
    }
  }
`;

