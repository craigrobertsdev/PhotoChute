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

  type Query {
    me(email: String): User
    photos: [Photo]
    getFileUploadUrl(serialisedGroupName: String!, blobName: String!): FileUrl
    getPhotosForGroup(serialisedGroupName: String!): Group
    getAuthenticationToken(groupName: String!): SasToken
    getSignedUrl(groupName: String!, fileName: String!): FileUrl
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFriend(username: String, phone: String): User
    savePhoto(
      fileName: String!
      url: String!
      fileSize: Float!
      ownerId: ID!
      groupId: ID!
      serialisedFileName: String!
    ): Photo
    createGroup(groupName: String!): Group
    deletePhoto(groupName: String!, photoId: ID!): Photo
  }
`;

module.exports = typeDefs;
