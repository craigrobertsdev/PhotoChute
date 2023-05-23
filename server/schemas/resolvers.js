const { User, Photo, Group } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const generateFileUploadUrlData = require("../utils/sasTokenGenerator");
const { ObjectId } = require("mongoose").Types;

const resolvers = {
  Query: {
    me: async (parent, args, context) => {},
    photos: async (parent, args, context) => {},
    getFileUploadUrl: async (parent, args, context) => {
      // if user exists on context, they are assumed to be logged in
      // if (!context.user) {
      //   throw new AuthenticationError("You need to be signed in to upload images");
      // }
      return await generateFileUploadUrlData();
    },
    getPhotosForGroup: async (parent, { group }, context) => {},
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
      const user = await User.findById(new ObjectId(userId));

      const newGroup = await Group.create({ name: groupName });

      const group = await Group.findOneAndUpdate(
        { _id: newGroup._id },
        {
          $addToSet: { members: { _id: new ObjectId(userId) } },
        },
        { new: true }
      );

      console.log(group);
      const { name, members, photos, containerUrl } = newGroup;

      return { name, members, photos, containerUrl };
    },

    savePhoto: async (parent, { fileName, url, fileSize, owner }) => {},

    addPhotoToGroup: async (parent, { photoId, groupId }) => {},

    deleteSinglePhoto: async (parent, { photoId }, context) => {},

    deleteManyPhotos: async (parent, { photoIds }, context) => {},
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
