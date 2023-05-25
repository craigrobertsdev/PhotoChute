const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const photoSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  groupId: {
    type: ObjectId,
    ref: "Group",
  },
  ownerId: {
    type: ObjectId,
    ref: "User",
  },
});

const Photo = model("Photo", photoSchema);

module.exports = Photo;
