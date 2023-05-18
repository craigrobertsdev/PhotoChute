const {
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol,
} = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

/**
 * @param containerName The name of the container that the blob will be uploaded to. This is the name of the group the user wants to upload to.
 *
 * @param fileName The name of the file being uploaded.
 *
 * @returns An object containing the storage account name, container name, blob name and the SAS token for the file upload
 */
async function generateFileUploadUrlData(containerName) {
  const sasToken = await createAccountSas();

  return { accountName, containerName, sasToken };
}

// information about sasOptions is located here: https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-account-delegation-sas-create-javascript?tabs=blob-service-client
async function createAccountSas() {
  const sasOptions = {
    services: AccountSASServices.parse("btqf").toString(), // b: blobs, t: tables, q: queues, f: files
    resourceTypes: AccountSASResourceTypes.parse("co").toString(), // c: container, o: object
    permissions: AccountSASPermissions.parse("rwu"), // permissions - r: read, w: write, u: update
    protocol: SASProtocol.Https,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 5 * 60 * 1000), // 5 minutes
  };

  const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  // prepend sasToken with `?`
  return sasToken[0] === "?" ? sasToken : `?${sasToken}`;
}

module.exports = generateFileUploadUrlData;
