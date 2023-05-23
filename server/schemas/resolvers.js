const { User, Photo, Group } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
<<<<<<< HEAD
const generateFileUploadUrlData = require("../utils/sasTokenGenerator");
<<<<<<< HEAD
<<<<<<< HEAD
=======
const { ObjectId } = require("mongoose").Types;
>>>>>>> 6f45c52 (added functions to handle container creation and photo deletion in blob storage)
=======
=======
const { generateFileUploadUrlData, getBlobSasUri } = require("../utils/sasTokenGenerator");
>>>>>>> 83af74d (refactored creation of fileUploadUrl to only grant access to specific resource)
const { getSingleBlob } = require("../utils/blobStorage");
>>>>>>> 701bfd2 (create group working, begin adding ability to get download link for files)

const resolvers = {
  Query: {
<<<<<<< HEAD
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('friends', 'groups', 'photos');
      }
      throw new AuthenticationError('Please log in');
    },

    photos: async (parent, args, context) => {
      if (context.user) {
        return Photo.find().populate('groups');
      }
    },

    getFileUploadUrl: async (parent, args, context) => {
=======
    me: async (parent, args, context) => {},
    photos: async (parent, args, context) => {},
    getFileUploadUrl: async (parent, { groupName, blobName }, context) => {
>>>>>>> 83af74d (refactored creation of fileUploadUrl to only grant access to specific resource)
      // if user exists on context, they are assumed to be logged in
      // if (!context.user) {
      //   throw new AuthenticationError("You need to be signed in to upload images");
      // }
      return await generateFileUploadUrlData(groupName, blobName, "rw");
    },
    getPhotosForGroup: async (parent, { group }, context) => {},
    // gets a signed url for the specified photoId
    getSignedUrl: async (parent, { groupName, blobName }, context) => {},
  },
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    createGroup: async (parent, { groupName, userId }, context) => {
      const user = await User.findById(userId);

      const newGroup = await (
        await Group.create({ name: groupName, members: [userId] })
      ).populate("members");

      const { name, members, photos, containerUrl } = newGroup;

      return { name, members, photos, containerUrl };
    },

    savePhoto: async (parent, { fileName, url, fileSize, owner }, context) => {
      return await User.findOneAndUpdate(
        { _id: context.user._id },
        {
          $addToSet: {
            photos: { fileName, url, uploadDate, fileSize, groups, owner },
          },
        },
        { new: true }
      );
    },

    addPhotoToGroup: async (parent, { photoId, groupId }) => {},

    deleteSinglePhoto: async (parent, { photoId }, context) => {},

<<<<<<< HEAD
    addFriend: async (parent, { username, email, password }) => {
      const user = await User.create({ username, phone });
      const token = signToken(user);
      return { token, user };
    },

=======
    deleteManyPhotos: async (parent, { photoIds }, context) => {},
>>>>>>> 6f45c52 (added functions to handle container creation and photo deletion in blob storage)
    //     singleUploadFile: async (parent, { username }, context) => {},
    //     saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
    //       // if there is a user attached to context, we know they have already been authenticated via the authMiddleware function
    //       if (!context.user) {
    //         throw new AuthenticationError("You need to be logged in to save books");
    //       }
    //       // added to ensure description has a value (some books don't) as the Book model requires a value
    //       if (!description) {
    //         description = " ";
    //       }
    //       return User.findOneAndUpdate(
    //         { _id: context.user._id },
    //         { $addToSet: { savedBooks: { authors, description, bookId, title, image, link } } },
    //         { new: true, runValidators: true }
    //       );
    //     },
    //     removeBook: async (parent, { bookId }, context) => {
    //       if (!context.user) {
    //         throw new AuthenticationError("You need to be logged in to delete books");
    //       }
    //       const updatedUser = await User.findOneAndUpdate(
    //         { _id: context.user._id },
    //         { $pull: { savedBooks: { bookId } } },
    //         { new: true }
    //       );
    //       return updatedUser;
    //     },
  },
};

module.exports = resolvers;
