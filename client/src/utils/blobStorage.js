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
  const containerClient = blobServiceClient.getContainerClient(containerName.toLowerCase());

  const containerExists = await containerClient.exists();

  if (!containerExists) {
    containerClient.create();
  }

  const blobName = tokeniseFileName(file.name);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    // upload the file to Azure blob storage. Doing so will trigger an automatic function to create a thumbnail
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    return blobName;
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
};

/**
 * @description Creates a unique file name based on the file name parameter and current timestamp.
 * @param {string} fileName
 */
function tokeniseFileName(fileName) {
  const name = fileName.slice(0, fileName.lastIndexOf("."));
  const extension = fileName.slice(fileName.lastIndexOf("."));

  return `${name.toLowerCase()}-${uuidv1()}${extension}`;
}

export default uploadFileToBlob;
