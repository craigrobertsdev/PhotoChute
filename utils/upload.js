const multer = require("multer");
const { uploadFileToBlob, uploadThumbnail } = require("./blobStorage");
const { v1: uuidv1 } = require("uuid");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

async function handleUpload(fileBuffer, containerName, fileSize, fileName) {
  const serialisedFileName = serialiseFileName(fileName);
  const fileUploadPromise = uploadFileToBlob(fileBuffer, containerName, serialisedFileName);
  const thumbnailUploadPromise = uploadThumbnail(fileBuffer, serialisedFileName);

  const fileData = await Promise.all([fileUploadPromise, thumbnailUploadPromise]);
  return fileData[0];
}

function serialiseFileName(fileName) {
  const name = fileName.slice(0, fileName.lastIndexOf("."));
  const fileExtension = fileName.slice(fileName.lastIndexOf("."));

  return `${name.toLowerCase()}-${uuidv1()}${fileExtension}`;
}

module.exports = { upload, handleUpload };
