const {
  AccountSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  generateAccountSASQueryParameters,
  BlobServiceClient,
} = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

/**
 *
 * @returns An object containing the storage account name, container name, blob name and the SAS token for the file upload
 */
async function generateFileUploadUrlData(containerName, blobName, permissions) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  // const sasToken = await createAccountSas(permissions);
  const fileUrlData = await getBlobSasUri(containerName, blobName, sharedKeyCredential, permissions);

  return fileUrlData;
}

// information about sasOptions is located here: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-account-delegation-sas-create-javascript?tabs=blob-service-client
async function createContainerSAS(containerName) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const TEN_MINUTES = 10 * 60 * 1000;
  const NOW = new Date();

  // set start time a little before current time to make sure any clock issues are avoided
  const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES);
  const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES);

  const sasOptions = {
    containerName,
    services: AccountSASServices.parse("b").toString(),
    resourceTypes: AccountSASResourceTypes.parse("co").toString(), // container, object
    permissions: AccountSASPermissions.parse("r"), // this is only for viewing photos in the account. other permissions are granted as needed
    protocol: SASProtocol.Https,
    startsOn: TEN_MINUTES_BEFORE_NOW,
    expiresOn: TEN_MINUTES_AFTER_NOW,
  };

  const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  // prepend sasToken with `?`
  return { sasToken: sasToken[0] === "?" ? sasToken : `?${sasToken}` };
}

/**
 *
 * @param {string} containerName The name of the container for the stored photo
 * @param {string} blobName The file name as stored in the storage container
 * @param {StorageSharedKeyCredential} sharedKeyCredential
 * @param {string} permissions a string cotaining any combination of "r" = read, "w" = write
 * @returns A signed URL with temporary access to the given resource
 */
async function getBlobSasUri(containerName, blobName, sharedKeyCredential, permissions) {
  let tokenDuration;
  const serialisedBlobName = serialiseBlobName(blobName);

  // if the token grants write access, give it a duration of 1 minute, otherwise it will have 10 minutes for
  if (permissions.includes("w")) {
    tokenDuration = 1 * 60 * 1000; // 1 minute
  } else {
    tokenDuration = 10 * 60 * 1000; // 10 minutes
  }

  const sasOptions = {
    containerName,
    blobName: serialisedBlobName,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + tokenDuration),
    permissions: BlobSASPermissions.parse(permissions),
  };

  const blobServiceClient = new BlobServiceClient(`https://${accountName}/blob.core.windows.net`, sharedKeyCredential);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  return {
    fileUrl: `https://${accountName}.blob.core.windows.net/${containerName}/${serialisedBlobName}?${sasToken}`,
    serialisedFileName: serialisedBlobName,
  };
}

function getSignedUrl(containerName, fileName) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  const TEN_MINUTES = 10 * 60 * 1000;
  const NOW = new Date();
  const TEN_MINUTES_BEFORE_NOW = new Date(NOW.valueOf() - TEN_MINUTES);
  const TEN_MINUTES_AFTER_NOW = new Date(NOW.valueOf() + TEN_MINUTES);

  const sasOptions = {
    containerName,
    blobName: fileName,
    startsOn: TEN_MINUTES_BEFORE_NOW,
    expiresOn: TEN_MINUTES_AFTER_NOW,
    permissions: BlobSASPermissions.parse("r"),
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  return `https://photochute.blob.core.windows.net/${containerName}/${fileName}?${sasToken}`;
}

function serialiseBlobName(fileName) {
  const name = fileName.slice(0, fileName.lastIndexOf("."));
  const fileExtension = fileName.slice(fileName.lastIndexOf("."));

  return `${name.toLowerCase()}-${uuidv1()}${fileExtension}`;
}

module.exports = { generateFileUploadUrlData, createContainerSAS, getSignedUrl };
