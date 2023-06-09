import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me($email: String) {
    me(email: $email) {
      _id
      email
      username
      firstName
      friends {
        username
        firstName
        lastName
        _id
      }
      groups {
        _id
        name
        groupOwner {
          _id
        }
        serialisedGroupName
      }
      phone
      photos {
        _id
      }
      maxPhotos
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

export const GET_AUTHENTICATION_TOKEN = gql`
  query getAuthenticationToken($groupName: String!) {
    getAuthenticationToken(groupName: $groupName) {
      sasToken
    }
  }
`;

export const GET_SIGNED_URL = gql`
  query getSignedUrl($groupName: String!, $serialisedFileName: String!) {
    getSignedUrl(groupName: $groupName, serialisedFileName: $serialisedFileName) {
      fileUrl
    }
  }
`;
