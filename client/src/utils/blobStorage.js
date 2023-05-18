import { BlobServiceClient } from "@azure/storage-blob";
const { v1: uuidv1 } = require("uuid");

/**
 * @description This function
 * @param {File} file The actual file or Stream to be uploaded
 * @param {string} containerName The name of the container for files to be uploaded to
 * @param {string} sasToken The Secure Access Signature token for uploading files to blob storage
 */
const uploadFileToBlob = async (file, containerName, sasToken) => {
  // create a new BlobServiceClient with the Blob service URL and SAS token
  const blobServiceClient = new BlobServiceClient(
    `https://photochute.blob.core.windows.net/${sasToken}`
  );

  // Get a reference to a container
  // const containerClient = blobServiceClient.getContainerClient(containerName.toLowerCase());
  const containerClient = blobServiceClient.getContainerClient("container");

  const containerExists = await containerClient.exists();

  if (!containerExists) {
    containerClient.create();
  }

  const blobName = tokeniseFileName(file.name);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // upload the file to blob storage
  try {
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    return `https://photochute.blob.core.windows.net/${containerName}/${blobName}/?${sasToken}`;
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
};

/**
 * @description Creates a unique file name based on the file name parameter and current timestamp.
 * @param {string} fileName
 */
function tokeniseFileName(fileName) {
  return fileName.toLowerCase() + uuidv1();
}

export default uploadFileToBlob;
