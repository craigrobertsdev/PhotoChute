const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { dbLogger } = require("../logging/logger");
const { createBlobStorageContainer } = require("../utils/blobStorage");

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: validateGroupName,
      message:
        "Group name must be no more than 30 characters long and not include consecutive '-' characters",
    },
  },
  members: [
    {
      type: [ObjectId],
      ref: "User",
      default: [],
    },
  ],
  photos: [
    {
      type: [ObjectId],
      ref: "Photo",
      default: [],
    },
  ],
  containerUrl: {
    type: String,
  },
});

groupSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this.containerUrl = await createBlobStorageContainer(this.name);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      dbLogger.error(JSON.stringify(err, null, 2));
    }
  }
  next();
});

groupSchema.pre("deleteOne", async function (next) {
  try {
  } catch (err) {
    dbLogger.error(JSON.stringify({ err }));
  }
});

/**
 * @description ensures that group names are no longer than 30 characters long and conform to the requirements of Azure Blob Storage container naming rules
 * @param {string} name
 * @returns true if input conforms to the required naming convention, false if not
 */
function validateGroupName(name) {
  if (name.length > 30) return false;
  // TODO
  // implement regex to determine 2 consecutive '-' characters.

  return !name.match(/[-]{2}/);
}

const Group = model("Group", groupSchema);

module.exports = Group;
