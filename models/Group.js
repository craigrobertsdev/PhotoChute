const { Schema, model } = require("mongoose");
// const { dbLogger } = require("../logging/logger");
const { createBlobStorageContainer } = require("../utils/blobStorage");

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: validateGroupName,
        message:
          "Group name must be between 3 and 30 characters long and not include consecutive '-' characters",
      },
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    photos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Photo",
      },
    ],
    containerUrl: {
      type: String,
    },
    serialisedGroupName: {
      type: String,
    },
    maxPhotos: {
      type: Number,
      default: 15,
    },
    maxMembers: {
      type: Number,
      default: 10,
    },
  }, // set this to use virtual below
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

groupSchema.virtual("photoCount").get(function () {
  return this.photos.length;
});

groupSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this.containerUrl = await createBlobStorageContainer(this.name);
      this.serialisedGroupName = this.containerUrl.slice(this.containerUrl.lastIndexOf("/") + 1);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      // dbLogger.error(JSON.stringify(err, null, 2));
    }
  }
  next();
});

groupSchema.pre("deleteOne", async function (next) {
  try {
  } catch (err) {
    // dbLogger.error(JSON.stringify({ err }));
    console.error(JSON.stringify(err, null, 2));
  }
});

/**
 * @description ensures that group names are no longer than 30 characters long and conform to the requirements of Azure Blob Storage container naming rules
 * @param {string} name
 * @returns true if input conforms to the required naming convention, false if not
 */
function validateGroupName(name) {
  if (name.length < 3 || name.length > 30) return false;
  // TODO
  // implement regex to determine 2 consecutive '-' characters.

  return !name.match(/--/);
}

const Group = model("Group", groupSchema);

module.exports = Group;
