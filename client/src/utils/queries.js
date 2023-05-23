import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const GET_FILE_UPLOAD_URL = gql`
  query getFileUploadUrl {
    getFileUploadUrl {
      sasToken
    }
  }
`;

export const GET_PHOTOS_FOR_GROUP = gql`
  query getPhotosForGroup($groupName: String!) {
    getPhotosForGroup(groupName: $groupName) {
      group {
        name
        members {
          username
          photos {
            fileName
            url
            uploadDatefileSize
          }
        }
      }
    }
  }
`
