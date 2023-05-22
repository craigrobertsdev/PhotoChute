import { gql } from "@apollo/client";

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      phone
      groups {
        _id
        name
        members {
          _id
          username
        }
      }
      photos {
        _id
        fileName
        url
        uploadDate
        fileSize
        groups {
          _id
          name
        }
        owner
      }
    }
  }
`;

export const GET_PHOTOS = gql`
  query photos {
      photos {
        _id
        fileName
        url
        uploadDate
        fileSize
        groups {
          _id
          name
        }
        owner
      }
    }
  }
`;
