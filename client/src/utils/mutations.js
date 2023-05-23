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

export const SAVE_BOOK = gql`
  mutation saveBook(
    $bookId: String
    $authors: [String]
    $description: String
    $title: String
    $image: String
    $link: String
  ) {
    saveBook(
      bookId: $bookId
      authors: $authors
      description: $description
      title: $title
      image: $image
      link: $link
    ) {
      _id
      username
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

export const CREATE_GROUP = gql`
  mutation createGroup($groupName: String!, $userId: ID!) {
    createGroup(groupName: $groupName, userId: $userId) {
      name
      members {
        _id
        username
        email
      }
      photos {
        _id
      }
      containerUrl
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
