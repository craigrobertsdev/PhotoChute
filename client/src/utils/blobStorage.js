import { BlockBlobClient } from "@azure/storage-blob";

/**
 * @description Uploads the provided file to the blob storage account via a temporarily signed URL
 * @param {File} file The actual file or Stream to be uploaded
 * @param {string} signedUrl The URL received from the server which contains an access token specific to the resource location we are uploading the image to
 */
async function uploadFileToBlob(file, signedUrl) {
  const blockBlobClient = new BlockBlobClient(signedUrl);

  try {
    // upload the file to Azure blob storage. Doing so will trigger an automatic function to create a thumbnail
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type,
      },
    });
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
}
export default uploadFileToBlob;
