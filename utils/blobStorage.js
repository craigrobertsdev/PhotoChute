const { BlobServiceClient, BlockBlobClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const Jimp = require("jimp");
const stream = require("stream");
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
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING_SAS);
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

  const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

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
  const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.CONNECTION_STRING_SAS);

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

/**
 * @description Uploads the provided file to the blob storage account via a temporarily signed URL
 * @param {Buffer} fileBuffer The actual file or Stream to be uploaded
 * @param {string} fileName
 */
async function uploadFileToBlob(fileBuffer, containerName, fileName) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const baseUrl = `https://${accountName}.blob.core.windows.net`;

  const blockBlobClient = new BlockBlobClient(`${baseUrl}/${containerName}/${fileName}`, sharedKeyCredential);
  const extension = fileName.split(".").pop();
  const mimetype = `image/${extension}`;
  try {
    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: mimetype,
      },
    });

    return {
      serialisedFileName: fileName,
      fileUrl: `${baseUrl}/${containerName}/${fileName}`,
    };
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
}

async function uploadThumbnail(fileBuffer, fileName) {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
  const ONE_MEGABYTE = 1024 * 1024;
  const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
  const containerName = "thumbnails";

  const widthInPixels = 250;
  Jimp.read(fileBuffer).then((thumbnail) => {
    thumbnail.resize(widthInPixels, Jimp.AUTO).quality(80);

    thumbnail.getBuffer(Jimp.MIME_PNG, async (err, buffer) => {
      const readStream = stream.PassThrough();
      readStream.end(buffer);

      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
      const baseUrl = `https://${accountName}.blob.core.windows.net`;

      const blockBlobClient = new BlockBlobClient(`${baseUrl}/${containerName}/${fileName}`, sharedKeyCredential);

      try {
        const uploadResponse = await blockBlobClient.uploadStream(readStream, uploadOptions.bufferSize, uploadOptions.maxBuffers, {
          blobHTTPHeaders: { blobContentType: "image/jpeg" },
        });

        return `https://photochute.blob.core.windows.net/thumbnails/${fileBuffer.name}`;
      } catch (err) {
        context.log(err.message);
      }
    });
  });
}

module.exports = {
  createBlobStorageContainer,
  deleteBlob,
  deleteContainer,
  uploadFileToBlob,
  uploadThumbnail,
};
