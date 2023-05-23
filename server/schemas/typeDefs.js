const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    phone: String
    friends: [User]
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
    photos: [Photo]
    containerUrl: String
  }

  type Auth {
    token: String
    user: User
  }

  type FileUrl {
    fileUrl: String
  }

  type Query {
    me: User
    photos: [Photo]
    getFileUploadUrl(groupName: String!, blobName: String!): FileUrl
    getPhotosForGroup(groupName: String!): Group
    getSignedUrl(groupName: String!, blobName: String!): FileUrl
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFriend(username: String, phone: String): User
    savePhoto(fileName: String!, url: String!, fileSize: Int!, owner: ID!): User
    addPhotoToGroup(photoId: ID!, groupId: ID!): Group
    createGroup(groupName: String!, userId: ID!): Group
    deleteSinglePhoto(photoId: ID!): ID
    deleteManyPhotos(photoIds: [ID]!): [ID]
  }
`;

module.exports = typeDefs;
