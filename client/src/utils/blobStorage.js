import { BlockBlobClient } from "@azure/storage-blob";
const { v1: uuidv1 } = require("uuid");

/**
 * @description Uploads the provided file to the blob storage account via a temporarily signed URL
 * @param {File} file The actual file or Stream to be uploaded
 * @param {string} signedUrl The URL received from the server which contains an access token specific to the resource location we are uploading the image to
 */
async function uploadFileToBlob(file, signedUrl) {
  const blockBlobClient = new BlockBlobClient(signedUrl);

  try {
    // upload the file to Azure blob storage. Doing so will trigger an automatic function to create a thumbnail
    const response = await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });

    return response.json();
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
}

/**
 * @description Creates a unique file name based on the file name parameter and current timestamp.
 * @param {string} fileName
 */
function tokeniseFileName(fileName) {
  const name = fileName.slice(0, fileName.lastIndexOf("."));
  const fileExtension = fileName.slice(fileName.lastIndexOf("."));

  return `${name.toLowerCase()}-${uuidv1()}${fileExtension}`;
}

export default uploadFileToBlob;
