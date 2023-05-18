const {
  generateAccountSASQueryParameters,
  AccountSASPermissions,
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol,
} = require("@azure/storage-blob");
const { v1: uuidv1 } = require("uuid");

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
async function generateFileUploadUrl(containerName) {
  const sasToken = await createAccountSas();

  return { accountName, containerName, sasToken };
}

async function createAccountSas() {
  const sasOptions = {
    services: AccountSASServices.parse("btqf").toString(), // blobs, tables, queues, files
    resourceTypes: AccountSASResourceTypes.parse("co").toString(), // service, container, object - options are "sco"
    permissions: AccountSASPermissions.parse("w"), // permissions - options are "rwdlacupi"
    protocol: SASProtocol.HttpsAndHttp,
    startsOn: new Date(),
    expiresOn: new Date(new Date().valueOf() + 5 * 60 * 1000), // 5 minutes
  };

  const sasToken = generateAccountSASQueryParameters(sasOptions, sharedKeyCredential).toString();

  // console.log(`sasToken = '${sasToken}'\n`);

  // prepend sasToken with `?`
  return sasToken[0] === "?" ? sasToken : `?${sasToken}`;
}

module.exports = generateFileUploadUrl;
