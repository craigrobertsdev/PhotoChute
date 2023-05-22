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
