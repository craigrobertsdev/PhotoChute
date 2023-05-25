import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import uploadFileToBlob from "../utils/blobStorage";
import { GET_FILE_UPLOAD_URL } from "../utils/queries";
import { SAVE_PHOTO } from "../utils/mutations";

const Azure = () => {
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState();
  const [uploading, setUploading] = useState(false);
  const [getFileUploadUrl] = useLazyQuery(GET_FILE_UPLOAD_URL);
  const [fileTypeValidationError, setFileTypeValidationError] = useState(false);
  const [savePhoto] = useMutation(SAVE_PHOTO);

  const onFileChange = (event) => {
    // capture file into state
    setFileSelected(event.target.files[0]);

    // validateFileType(fileSelected.type);
  };

  useEffect(() => {
    validateFileType(fileSelected?.type);
  }, [fileSelected]);

  const onFileUpload = async () => {
    if (fileSelected && fileSelected?.name) {
      // prepare UI
      setUploading(true);
      try {
        // TODO - find a way to get the current group's containerName instead of hard coded value
        const groupName = "the-walruses-a4e50880-faa3-11ed-a777-394dc37315ec";

        const urlData = await getFileUploadUrl({
          variables: {
            groupName,
            blobName: fileSelected.name,
          },
        });

        const { fileUrl } = urlData.data.getFileUploadUrl;

        // *** UPLOAD TO AZURE STORAGE ***
        const fileUploadUrl = await uploadFileToBlob(fileSelected, fileUrl);

        // reset state/form
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
      }
      setFileSelected(null);
      setFileName("");
      setUploading(false);
    }
  };

  /**
   * @description Checks whether the file is of type jpg, jpeg or png
   *
   * @param {string} fileType The type of file to check against
   */
  function validateFileType(fileType) {
    if (!(fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/jpg")) {
      setFileTypeValidationError(true);
    }
  }

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} />
      <button
        type="submit"
        onClick={onFileUpload}
        // disabled={fileTypeValidationError}
      >
        Upload!
      </button>
    </div>
  );

  return (
    <div>
      <h1>Upload file to Azure Blob Storage</h1>
      {!uploading && DisplayForm()}
      {uploading && <div>Uploading</div>}
      {fileTypeValidationError && <div>File must be of type jpg, jpeg or png</div>}
      <hr />
      <h1>Upload and Share</h1>
      <p>Post your photos and connect with friends through your favourite memories!</p>
      <img></img>
    </div>
  );
};

export default Azure;
