import { gql } from "@apollo/client";

export const GET_ME = gql`
  query Me {
  me {
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
