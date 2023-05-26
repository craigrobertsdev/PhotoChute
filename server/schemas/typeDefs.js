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

  type Query {
    me(email: String): User
    photos: [Photo]
    getFileUploadUrl(serialisedGroupName: String!, blobName: String!): FileUrl
    getPhotosForGroup(serialisedGroupName: String!): Group
    getSignedUrl(groupName: String!, blobName: String!): FileUrl
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
    addPhotoToGroup(photoId: ID!, groupId: ID!): Group
    createGroup(groupName: String!): Group
    deleteSinglePhoto(photoId: ID!): ID
    deleteManyPhotos(photoIds: [ID]!): [ID]
  }
`;

module.exports = typeDefs;
