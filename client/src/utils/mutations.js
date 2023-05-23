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
  mutation SavePhoto($fileName: String!, $url: String!, $fileSize: Int!, $owner: ID!) {
  savePhoto(fileName: $fileName, url: $url, fileSize: $fileSize, owner: $owner) {
    _id
    username
  }
}
`;

<<<<<<< HEAD
export const ADD_PHOTO = gql`
  mutation AddPhotoToGroup($photoId: ID!, $groupId: ID!) {
  addPhotoToGroup(photoId: $photoId, groupId: $groupId) {
    _id
    name
  }
}
`;

export const REMOVE_PHOTO = gql`
  mutation RemovePhoto($photoId: ID!) {
  removePhoto(photoId: $photoId) {
    _id
    username
  }
}
`;

=======
>>>>>>> 701bfd2 (create group working, begin adding ability to get download link for files)
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
