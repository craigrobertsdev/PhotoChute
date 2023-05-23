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
 *
 * @returns An object containing the storage account name, container name, blob name and the SAS token for the file upload
 */
async function generateFileUploadUrlData(permissions) {
  const sasToken = await createAccountSas(permissions);

  return { sasToken };
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

module.exports = generateFileUploadUrlData;
