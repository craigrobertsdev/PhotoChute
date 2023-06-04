const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    username: String
    maxPhotos: Int
    email: String
    phone: String
    friends: [User]
    groups: [Group]
    photos: [Photo]
  }

  type Group {
    _id: ID
    name: String
    members: [User]
    groupOwner: User
    photos: [Photo]
    containerUrl: String
    serialisedGroupName: String
    maxPhotos: Int
    photoCount: Int
    maxMembers: Int
  }

  type Photo {
    _id: ID
    fileName: String
    url: String
    uploadDate: String
    fileSize: Float
    group: Group
    owner: User
    serialisedFileName: String
    thumbnailUrl: String
  }

  type Auth {
    token: String
    user: User
  }

  type FileUrl {
    fileUrl: String
    serialisedFileName: String
  }

  type SasToken {
    sasToken: String!
  }

  type Premium {
    session: ID
  }

  type Query {
    me(email: String): User
    photos: [Photo]
    getFileUploadUrl(serialisedGroupName: String!, blobName: String!): FileUrl
    getPhotosForGroup(serialisedGroupName: String!): Group
    getAuthenticationToken(groupName: String!): SasToken
    getSignedUrl(groupName: String!, serialisedFileName: String!): FileUrl
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      password: String!
    ): Auth
    addFriend(username: String, phone: String): User
    savePhoto(
      fileName: String!
      url: String!
      fileSize: Float!
      ownerId: ID!
      groupId: ID!
      serialisedFileName: String!
    ): [Photo]
    createGroup(groupName: String!): Group
    deleteGroup(groupName: String!): Group
    deletePhoto(groupId: ID!, groupName: String!, photoId: ID!): [Photo]
    addGroupMembers(groupId: ID!, memberIds: [ID]!): Group
    removeGroupMembers(groupId: ID!, memberIds: [ID]!): Group
    deleteAccount: User
    buyPremium(premium: Int): Premium
  }
`;

module.exports = typeDefs;
