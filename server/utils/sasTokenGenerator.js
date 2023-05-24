const {
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  BlobServiceClient,
} = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

console.log(accountName, accountKey)

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

/**
 *
 * @returns An object containing the storage account name, container name, blob name and the SAS token for the file upload
 */
async function generateFileUploadUrlData(containerName, blobName, permissions) {
  // const sasToken = await createAccountSas(permissions);
  const fileUrl = await getBlobSasUri(containerName, blobName, sharedKeyCredential, permissions);

  return { fileUrl };
}

// information about sasOptions is located here: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-account-delegation-sas-create-javascript?tabs=blob-service-client

/**
 *
 * @param {String} permissions A string with the necessary permissions for the action the token is being generated for. For example, "rwu" = read, write and update permissions
 * @returns
 */
async function createAccountSas(permissions) {
  const sasOptions = {
    services: AccountSASServices.parse("btqf").toString(), // b: blobs, t: tables, q: queues, f: files
    resourceTypes: AccountSASResourceTypes.parse("co").toString(), // c: container, o: object
    permissions: AccountSASPermissions.parse(permissions), // permissions - r: read, w: write, u: update
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 3 * 60 * 1000), // 3 minutes
  };

  const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  // prepend sasToken with `?`
  return sasToken[0] === "?" ? sasToken : `?${sasToken}`;
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

  // if the token grants write access, give it a duration of 1 minute, otherwise it will have 10 minutes for
  if (permissions.includes("w")) {
    tokenDuration = 1 * 60 * 1000; // 1 minute
  } else {
    tokenDuration = 10 * 60 * 1000; // 10 minutes
  }

  const sasOptions = {
    containerName,
    blobName: blobName,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + tokenDuration),
    permissions: BlobSASPermissions.parse(permissions),
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  console.log(`SAS token for blob is: ${sasToken}`);

  return `https://photochute.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}

module.exports = { generateFileUploadUrlData, getBlobSasUri };
