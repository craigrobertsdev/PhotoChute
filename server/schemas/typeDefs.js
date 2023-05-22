const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type User {
    _id: ID
    username: String
    email: String
    groups: [Group]
    photos: [Photo]
  }

  type Photo {
    _id: ID
    fileName: String!
    url: String!
    uploadDate: String
    fileSize: Int
    groups: [Group]
    owner: User!
  }

  type Group {
    _id: ID
    name: String
    members: [User]
  }

  type Auth {
    token: String
    user: User
  }

  type FileUrl {
    sasToken: String!
  }

  type Query {
    me: User
    photos: [Photo]
    getFileUploadUrl: FileUrl
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    savePhoto(fileName: String!, url: String!, fileSize: Int!, owner: ID!): User
    addPhotoToGroup(photoId: ID!, groupId: ID!): Group
    removePhoto(photoId: ID!): User

    #singleUploadFile(user: User!): Photo
    #singleUploadStream(file: Upload!): File!
  }
`;

module.exports = typeDefs;
