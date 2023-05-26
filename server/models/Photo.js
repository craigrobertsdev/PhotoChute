const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Types;

const photoSchema = new Schema(
  {
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
    group: {
      type: ObjectId,
      ref: "Group",
    },
    owner: {
      type: ObjectId,
      ref: "User",
    },
    serialisedFileName: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

photoSchema.virtual("thumbnailUrl").get(function () {
  const urlSegments = this.url.split("/");
  urlSegments[3] = "thumbnails";

  return urlSegments.join("/");
});

const Photo = model("Photo", photoSchema);

module.exports = Photo;
