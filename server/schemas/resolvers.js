const { User, Photo, Group } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
const {
  generateFileUploadUrlData,
  getSignedUrl,
  createContainerSAS,
} = require("../utils/sasTokenGenerator");
const { deleteBlob } = require("../utils/blobStorage");
const { ObjectId } = require("mongoose").Types;

const resolvers = {
  Query: {
    me: async (parent, { email }, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("friends", "groups", "photos");
      } else if (email) {
        return User.findOne({ email }).populate("friends groups photos");
      }

      throw new AuthenticationError("Please log in");
    },

    photos: async (parent, args, context) => {
      if (context.user) {
        return Photo.find().populate("groups");
      }
    },

    getFileUploadUrl: async (parent, { serialisedGroupName, blobName }, context) => {
      // if user exists on context, they are assumed to be logged in
      if (!context.user) {
        throw new AuthenticationError("You need to be signed in to upload images");
      }

      const group = await Group.findOne({ serialisedGroupName });

      if (group.photos.length >= group.maxPhotos) {
        return new Error("Cannot exceed maximum number of photos for the group.");
      }

      return await generateFileUploadUrlData(serialisedGroupName, blobName, "rw");
    },
    getPhotosForGroup: async (parent, { serialisedGroupName }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to access a group's photos");
      }

      const userGroup = await (
        await Group.findOne({ serialisedGroupName })
      ).populate([
        {
          path: "photos",
          populate: {
            path: "owner",
          },
        },
        {
          path: "groupOwner",
          populate: {
            path: "friends",
          },
        },
        { path: "members" },
      ]);

      console.log(userGroup.toJSON());

      if (!userGroup) {
        return new Error("No group could be found with that name");
      }

      // const populatedUserGroup = await userGroup.populate("groupOwner members");

      if (
        !userGroup.members?.includes(context.user._id) &&
        !userGroup.groupOwner._id.equals(context.user._id)
      ) {
        return new AuthenticationError("You are not a member of this group");
      }

      return userGroup;
    },
    getAuthenticationToken: async (parent, { groupName }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to access a group's photos");
      }

      const group = await Group.findOne({ serialisedGroupName: groupName });

      if (
        !group.members?.includes(context.user._id) &&
        !group.groupOwner._id.equals(context.user._id)
      ) {
        return new AuthenticationError("You are not a member of this group");
      }

      return await createContainerSAS(groupName);
    },

    getSignedUrl: async (parent, { groupName, serialisedFileName }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to access a group's photos");
      }

      const photo = await Photo.findOne({ serialisedFileName });

      const group = (await photo.populate("group")).group;

      if (!photo) {
        return new Error("Photo not found");
      }

      if (context.user !== photo.owner && !group.groupOwner._id.equals(context.user._id)) {
        return new AuthenticationError("Only the owner is authorised to delete a photo");
      }

      return { fileUrl: getSignedUrl(groupName, serialisedFileName) };
    },
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
      if (!context.user) {
        return new AuthenticationError("You must be signed in to create a group");
      }

      const user = await User.findById(context.user._id);

      const newGroup = await (
        await Group.create({ name: groupName, groupOwner: user })
      ).populate("groupOwner");

      const { name, groupOwner, photos, containerUrl, serialisedGroupName } = newGroup;

      return { name, groupOwner, photos, containerUrl, serialisedGroupName };
    },

    savePhoto: async (
      parent,
      { fileName, url, fileSize, ownerId, groupId, serialisedFileName },
      context
    ) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to create a group");
      }

      const newPhoto = await Photo.create({
        fileName,
        url,
        fileSize,
        uploadDate: Date.now(),
        owner: ownerId,
        group: groupId,
        serialisedFileName,
      });

      await User.findOneAndUpdate(
        { _id: context.user._id },
        {
          $addToSet: {
            photos: newPhoto,
          },
        },
        { new: true }
      );

      await Group.findOneAndUpdate(
        { _id: groupId },
        {
          $addToSet: {
            photos: newPhoto,
          },
        },
        { new: true }
      );

      return newPhoto;
    },
    deletePhoto: async (parent, { groupName, photoId }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to create a group");
      }

      const group = await Group.findOne({ serialisedGroupName: groupName });

      if (
        !group.members?.includes(context.user._id) &&
        !group.groupOwner._id.equals(context.user._id)
      ) {
        return new AuthenticationError("You are not authorised to delete this photo");
      }

      const photoToDelete = await Photo.findById(photoId);

      try {
        await deleteBlob(groupName, photoToDelete.serialisedFileName);
      } catch (err) {
        console.error(err);
      }

      const deletedPhoto = await Photo.findOneAndDelete({ _id: photoId });

      if (!deletedPhoto) {
        return new Error("Photo could not be located");
      }

      // remove the photo from the group's photo array
      const updatedGroup = await Group.findOneAndUpdate(
        { serialisedGroupName: groupName },
        {
          $pull: { photos: new ObjectId(deletedPhoto._id) },
        },
        { new: true }
      );

      const updatedUser = await User.findOneAndUpdate(
        { _id: deletedPhoto.owner },
        {
          $pull: { photos: new ObjectId(deletedPhoto._id) },
        },
        { new: true }
      );

      return deletedPhoto;
    },

    addFriend: async (parent, { username, email, password }) => {
      const user = await User.create({ username, phone });
      const token = signToken(user);
      return { token, user };
    },
    addGroupMembers: async (parent, { groupId, memberIds }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to create a group");
      }

      const group = await Group.findById(groupId);

      if (!group) {
        return new Error("Group not found");
      }

      if (!group.groupOwner.equals(context.user._id)) {
        return new AuthenticationError("Only the owner of the group can add members");
      }

      const updatedGroup = await Group.findOneAndUpdate(
        { _id: groupId },
        {
          $addToSet: { members: { $each: [...memberIds] } },
        },
        {
          new: true,
        }
      );

      console.log((await updatedGroup.populate("members")).toJSON());

      return updatedGroup;
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
