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
    $firstName: String!
    $lastName: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      username: $username
      email: $email
      password: $password
    ) {
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
    deleteGroup(groupName: $groupName) {
      _id
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
    $serialisedGroupName: String!
  ) {
    savePhoto(
      fileName: $fileName
      url: $url
      fileSize: $fileSize
      ownerId: $ownerId
      groupId: $groupId
      serialisedFileName: $serialisedFileName
      serialisedGroupName: $serialisedGroupName
    ) {
      _id
      name
      members {
        _id
        firstName
        lastName
        maxPhotos
        photos {
          _id
        }
      }
      groupOwner {
        _id
        firstName
        lastName
        friends {
          _id
          firstName
          lastName
          maxPhotos
        }
        photos {
          _id
        }
        maxPhotos
      }
      photos {
        _id
        fileName
        url
        uploadDate
        fileSize
        owner {
          _id
          firstName
        }
        group {
          groupOwner {
            _id
          }
        }
        serialisedFileName
        thumbnailUrl
      }
      containerUrl
      serialisedGroupName
      maxPhotos
      photoCount
      maxMembers
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
  mutation deleteSinglePhoto(
    $groupId: ID!
    $groupName: String!
    $photoId: ID!
    $serialisedGroupName: String!
  ) {
    deletePhoto(
      groupId: $groupId
      groupName: $groupName
      photoId: $photoId
      serialisedGroupName: $serialisedGroupName
    ) {
      _id
      name
      members {
        _id
        firstName
        lastName
        maxPhotos
        photos {
          _id
        }
      }
      groupOwner {
        _id
        firstName
        lastName
        friends {
          _id
          firstName
          lastName
          maxPhotos
        }
        photos {
          _id
        }
        maxPhotos
      }
      photos {
        _id
        fileName
        url
        uploadDate
        fileSize
        owner {
          _id
          firstName
        }
        group {
          groupOwner {
            _id
          }
        }
        serialisedFileName
        thumbnailUrl
      }
      containerUrl
      serialisedGroupName
      maxPhotos
      photoCount
      maxMembers
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
`;

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
