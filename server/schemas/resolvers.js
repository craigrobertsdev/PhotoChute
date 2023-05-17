const { User, Photo, Group } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const generateFileUploadUrl = require("../utils/sasTokens");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {},
    photos: async (parent, args, context) => {},

    //     // finds the logged in user based on the passed token's user _id if it exists
    //     me: async (parent, args, context) => {
    //       if (context.user) {
    //         return await User.findOne({ _id: context.user._id }).populate("savedBooks");
    //       }
    //     },
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

    savePhoto: async (parent, { fileName, url, fileSize, owner }) => {},

    addPhotoToGroup: async (parent, { photoId, groupId }) => {},

    removePhoto: async (parent, { photoId }) => {},

    getFileUploadUrl: async (parent, { groupName, fileName }, context) => {
      // if user exists on context, they are assumed to be logged in
      if (!context.user) {
        throw new AuthenticationError("You need to be signed in to upload images");
      }

      if (!groupName) {
        throw new AuthenticationError("A group name needs to be supplied");
      }

      return generateFileUploadUrl(groupName, fileName);
    },
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
