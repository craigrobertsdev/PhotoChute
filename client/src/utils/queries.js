import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me($email: String) {
    me(email: $email) {
      _id
      email
      friends {
        username
        _id
      }
      groups {
        _id
      }
      phone
      photos {
        _id
      }
      username
    }
  }
`;

export const GET_PHOTOS = gql`
  query Photos {
    photos {
      _id
      fileName
      fileSize
      groups {
        _id
        name
      }
      owner {
        _id
        username
      }
      uploadDate
      url
    }
  }
`;

export const GET_FILE_UPLOAD_URL = gql`
  query getFileUploadUrl($serialisedGroupName: String!, $blobName: String!) {
    getFileUploadUrl(serialisedGroupName: $serialisedGroupName, blobName: $blobName) {
      fileUrl
      serialisedFileName
    }
  }
`;

export const GET_PHOTOS_FOR_GROUP = gql`
  query getPhotosForGroup($serialisedGroupName: String!) {
    getPhotosForGroup(serialisedGroupName: $serialisedGroupName) {
      _id
      name
      members {
        username
      }
      groupOwner {
        _id
        username
      }
      photos {
        fileName
        url
        uploadDate
        fileSize
        owner {
          username
        }
        serialisedFileName
        thumbnailUrl
      }
      containerUrl
      serialisedGroupName
      maxPhotos
      photoCount
    }
  }
`;
