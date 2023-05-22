const { BlobServiceClient, BlockBlobClient } = require("@azure/storage-blob");
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

// not currently being used as all images are stored in the "images" container
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

/**
 *
 * @param {string} fileUrl the url of the file to be deleted
 * @returns a promise that resolves when the file is deleted
 */
async function deleteBlob(fileName) {
  const blockBlobClient = new BlockBlobClient(
    process.env.CONNECTION_STRING_SAS,
    "images",
    fileName
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
 *
 * @param {[string]} fileNames the names of the blobs to be deleted
 */
async function deleteManyBlobs(fileNames) {
  try {
    const promises = [];
    for (const fileName of fileNames) {
      const blockBlobClient = new BlockBlobClient(process.env.CONNECTION_STRING_SAS, "images", fileName);
      promises.push(blockBlobClient.delete({
        deleteSnapshots: "include"
      }))
    }
  }
}

/**
 *
 * @param {string} blobName the name of the blob to be deleted
 */
async function getSingleBlob(blobName) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );

  const containerClient = blobServiceClient.getContainerClient("images");
}

/**
 *
 * @param {[string]} blobName an array of blob names for deletion
 */
async function getManyBlobs(blobName) {
  const containerClient = BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING_SAS);
}

module.exports = {
  createBlobStorageContainer,
  deleteBlob,
  deleteManyBlobs,
  getSingleBlob,
  getManyBlobs,
};
