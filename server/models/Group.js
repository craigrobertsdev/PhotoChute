const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { dbLogger } = require("../logs/logger");
const createBlobStorage = require("../utils/blobStorage");

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  ],
  containerName: {
    type: String,
  },
});

groupSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this.blobId = await createBlobStorageContainer(this.name);
    } catch (err) {
      dbLogger.error(JSON.stringify({ err }));
    }
  }
});

const Group = model("Group", groupSchema);

module.exports = Group;
