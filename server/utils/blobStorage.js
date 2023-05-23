const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
const generateFileUploadUrlData = require("./sasTokenGenerator");
// may need this in prod when server is running from my Azure details, rather than a SAS key
// const { DefaultAzureCredential } = require("@azure/identity");

/**
 * Creates a new blob storage container in Azure Storage each time a group model is created in the database.

 * @param {string} groupName The name of the group that will be used to create the unique blob container name
 *  
 * @returns {string} The url of the container
 *
 * @throws An error if there is an issue creating the blob container
 */

async function createBlobStorageContainer(groupName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );
  // create a unique name for the container
  const containerName = serialiseGroupName(groupName);
<<<<<<< HEAD
=======

>>>>>>> 6f45c52 (added functions to handle container creation and photo deletion in blob storage)
  // get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  // create the container
  /* const createContainerResponse = await containerClient.create();
<<<<<<< HEAD
=======

>>>>>>> 6f45c52 (added functions to handle container creation and photo deletion in blob storage)
  console.log(
    `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
  );

  console.log(containerClient.url.split("?")[0]);

  return containerClient.url.split("?")[0];
  */

  return "test.url";
}

/**
 * @description Removes spaces and capital letters from the group name and appends a GUID to it
 * @param {string} groupName the name to be serialised
 * @returns The serialised string. etc "this is my group name" => "this-is-my-group-name-{GUID}"
 */
function serialiseGroupName(groupName) {
  const newName = groupName.split(" ").join("-").toLowerCase();

  return `${newName}-${uuidv1()}`;
}

/**
 *
 * @param {string} fileUrl the url of the file to be deleted
 * @returns a promise that resolves when the file is deleted
 */
async function deleteBlob(containerName, blobName) {
  const blockBlobClient = new BlockBlobClient(
    process.env.CONNECTION_STRING_SAS,
    containerName,
    blobName
  );

  try {
    blockBlobClient.delete({
      deleteSnapshots: "include",
    });
  } catch (err) {
    console.error(err);
  }
}

/**
 * @description Deletes each file listed in the blobNames array. Does not return a value or wait for the deletion to finish. Sends of a request to the storage account then returns.
 * @param {string} containerName The name of the container in which the blobs to be deleted are located
 * @param {[string]} blobNames the names of the blobs to be deleted
 */
async function deleteManyBlobs(containerName, blobNames) {
  try {
    // iterate over the blobNames array and delete each blob
    for (const blobName of blobNames) {
      const blockBlobClient = new BlockBlobClient(
        process.env.CONNECTION_STRING_SAS,
        containerName,
        blobName
      );

      blockBlobClient.delete({
        deleteSnapshots: "include",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 *
 * @param {string} blobName the name of the blob to be deleted
 * @returns {string} A signed URL to the blob to enable viewing or downloading of the file
 */
async function getSingleBlob(containerName, blobName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const sasToken = await generateFileUploadUrlData("r");

  return `${blockBlobClient.url}${sasToken}`;
}

/**
 * @param {string} containerName The name of the container in which the blobs to be deleted are located
 * @param {[string]} blobNames an array of blob names for deletion
 * @returns {[{blobName: string, url: string}]} an array of objects containing the blob name and signed url for each files in the request
 */
async function getManyBlobs(containerName, blobNames) {
  const response = [];

  for (const blobName of blobNames) {
    response.push({
      blobName,
      url: getSingleBlob(containerName, blobName),
    });
  }

  return response;
}

module.exports = {
  createBlobStorageContainer,
  deleteBlob,
  deleteManyBlobs,
  getSingleBlob,
  getManyBlobs,
};
