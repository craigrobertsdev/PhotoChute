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

//getting stripe private key from .env file
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

//Declaring the 3 types of premium account and the data that stripe will use in the checkout
const premiumAccounts = new Map([
  [
    1,
    {
      price: 199,
      description:
        "You can now be in up to 5 groups at anyone time and have the ability to upload 20 photos, this is a great option who likes sharing a few photos with friend or family",
      name: "Photo Enthusiast",
    },
  ],
  [
    2,
    {
      price: 599,
      description:
        "You can now be in up to 10 groups at anyone time and have the ability to upload 35 photos, this is a great option who people who want to share lots of photos with lots of different people!",
      name: "Social Butterfly",
    },
  ],
  [
    3,
    {
      price: 999,
      description:
        "You can now be in up to 20 groups at anyone time and have the ability to upload 50 photos, this account type is reserved for the type of person who loves sharing lots photos and memories with family and friends",
      name: "Over Sharer",
    },
  ],
]);

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
          populate: [
            {
              path: "owner",
            },
            {
              path: "group",
            },
          ],
        },
        {
          path: "groupOwner",
          populate: {
            path: "friends",
          },
        },
        { path: "members" },
      ]);

      if (!userGroup) {
        return new Error("No group could be found with that name");
      }

      const groupMemberIds = userGroup.members.map((member) => member._id);
      const memberInGroup = groupMemberIds.filter((id) => id.equals(context.user._id));

      if (!memberInGroup.length && !userGroup.groupOwner._id.equals(context.user._id)) {
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
    createGroup: async (parent, { groupName }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to create a group");
      }

      const user = await User.findById(context.user._id);

      const newGroup = await (
        await Group.create({ name: groupName, groupOwner: user })
      ).populate("groupOwner");

      const { name, groupOwner, photos, containerUrl, serialisedGroupName } = newGroup;

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        {
          $addToSet: {
            groups: newGroup,
          },
        },
        { new: true }
      );

      console.log(updatedUser.toJSON());

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

      if (!memberIds.length) {
        return;
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

      return updatedGroup;
    },

    removeGroupMembers: async (parent, { groupId, memberIds }, context) => {
      if (!context.user) {
        return new AuthenticationError("You must be signed in to remove a group member");
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
          $pull: { members: { $in: memberIds } },
        },
        {
          new: true,
        }
      );
      return updatedGroup;
    },

    //mutation for buying premium using stripe checkout
    buyPremium: async (parent, { premium }, context) => {
      const url = new URL(context.headers.origin).origin;
      const line_items = [];

      //get selection type of what account has been selected
      const premiumAccount = premiumAccounts.get(premium);
      if (!premiumAccount) {
        throw "invalid product selection";
      }

      //creating a stripe product that will be sent to checkout
      const product = await stripe.products.create({
        name: premiumAccount.name,
        description: premiumAccount.description,
      });
      // price is added to product object
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: premiumAccount.price,
        currency: "aud",
      });
      //pushes price data in cents and quantity of product
      line_items.push({
        price: price.id,
        quantity: 1,
      });
      //sends total data to stripe checkout with method and mode for payment also provides a return url for both successful and un-successful purchases
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `http://localhost:3000/`,
        cancel_url: `http://localhost:3000/premium`,
      });
      //returns session id to be used in redirect in premium.jsx
      return { session: session.id };
    },
  },
};

module.exports = resolvers;
