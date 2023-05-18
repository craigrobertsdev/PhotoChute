// <snippet_package>
// THIS IS SAMPLE CODE ONLY - NOT MEANT FOR PRODUCTION USE
import { BlobServiceClient } from "@azure/storage-blob";
const { v1: uuidv1 } = require("uuid");

/**
 * @param {File} file
 * @param {string} uploadUrl
 * @param {string} groupName
 * @param {string} containerName
 */
const uploadFileToBlob = async (file, accountName, containerName, sasToken) => {
  console.log(sasToken);
  // create a new BlobServiceClient with the Blob service URL and SAS token
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/${sasToken}`
  );

  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient("photos");

  const containerExists = await containerClient.exists();
  if (!containerExists) {
    throw new Error(
      "The storage container for this group does not exist. Likely cause is the group has been deleted."
    );
  }

  const blobName = tokeniseFileName(file.name);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  console.log(
    `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
  );

  const uploadBlobResponse = await blockBlobClient.uploadData(file, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });
  console.log(uploadBlobResponse);
};

/**
 * @description Creates a unique file name based on the file name parameter and current timestamp.
 * @param {string} fileName
 */
function tokeniseFileName(fileName) {
  return fileName.toLowerCase() + uuidv1();
}

export default uploadFileToBlob;
