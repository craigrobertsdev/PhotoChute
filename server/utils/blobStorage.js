const { BlobServiceClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
// may need this in prod when server is running from my Azure details, rather than a SAS key
// const { DefaultAzureCredential } = require("@azure/identity");

/**
 * Creates a new blob storage container in Azure Storage each time a group model is created in the database.

 * @param {*} groupName The name of the group that will be used to create the unique blob container name
 *  
 * @returns The id of the blob
 *
 * @throws An error if there is an issue creating the blob container
 */

async function createBlobStorageContainer(groupName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );

  // create a unique name for the container
  const containerName = groupName + uuidv1();

  // get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // create the container
  const createContainerResponse = await containerClient.create();

  console.log(
    `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
  );
}

module.exports = createBlobStorageContainer;
