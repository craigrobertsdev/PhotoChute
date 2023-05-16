const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const { v1: uuidv1 } = require("uuid");

/**
 * Creates a new blob storage container in Azure Storage each time a group model is created in the database.

 * @param {*} groupName The name of the group that will be used to create the unique blob container name
 *  
 * @returns The id of the blob
 *
 * @throws An error if there is an issue creating the blob container
 */
async function createBlobStorageContainer(groupName) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  if (!accountName) throw Error("Azure Storage account name not found");

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );

  // create a unique name for the container
  const containerName = groupName + uuidv1();

  console.log("\nCreating container...");
  console.log("\t", containerName);

  // get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // create the container
  const createContainerResponse = await containerClient.create();

  console.log(
    `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`
  );

  // create a unique name for the blob
  const blobName = "quickstart" + uuidv1() + ".txt";

  // get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // display blobname and url
  console.log(
    `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
  );

  // upload data to the blob
  const data = "Hello world!";

  const uploadBlobResponse = await blockBlobClient.upload(data, data.length);

  console.log(`Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`);
}

/**
 *
 * @param {*} photo
 */
async function uploadToBlobContainer(photo) {}

module.exports = { createBlobStorageContainer, uploadToBlobContainer };
