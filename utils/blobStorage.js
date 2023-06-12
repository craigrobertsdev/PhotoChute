const {
  BlobServiceClient,
  BlockBlobClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");
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
  // get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  // create the container
  await containerClient.create();

  return containerClient.url.split("?")[0];
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
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const blobServiceClient = new BlobServiceClient(
    "https://photochute.blob.core.windows.net",
    sharedKeyCredential
  );

  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Create blob client from container client
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const thumbnailClient = blobServiceClient.getContainerClient("thumbnails");

  const thumbnailBlobClient = thumbnailClient.getBlockBlobClient(blobName);
  try {
    const deletePhoto = blockBlobClient.delete({
      deleteSnapshots: "include",
    });

    const deleteThumbnail = thumbnailBlobClient.delete({
      deleteSnapshots: "include",
    });

    await Promise.all([deletePhoto, deleteThumbnail]);
  } catch (err) {
    console.error(err);
  }
}

async function deleteContainer(containerName, blobNames) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.CONNECTION_STRING_SAS
  );

  // get a reference to the container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const thumbnailClient = blobServiceClient.getContainerClient("thumbnails");
  // delete the container
  await containerClient.delete();

  const thumbnailsToDelete = [];

  for (const blobName of blobNames) {
    thumbnailsToDelete.push(
      thumbnailClient.deleteBlob(blobName, {
        deleteSnapshots: "include",
      })
    );
  }
}

module.exports = {
  createBlobStorageContainer,
  deleteBlob,
  deleteContainer,
};
