const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { dbLogger } = require("../logging/logger");
const createBlobStorage = require("../utils/blobStorage");

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


async function createBlobStorageContainer(groupName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );
  // create a unique name for the container
  const containerName = serialiseGroupName(groupName);
  // get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  // create the container
  /* const createContainerResponse = await containerClient.create();
  console.log(
    `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
  );
  console.log(containerClient.url.split("?")[0]);
  return containerClient.url.split("?")[0];
  */
  return "test.url";
}

module.exports = Group;
