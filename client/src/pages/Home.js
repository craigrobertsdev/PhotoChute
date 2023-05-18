import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import uploadFileToBlob from "../utils/uploadFileToBlob";
import { GET_FILE_UPLOAD_URL } from "../utils/mutations";
const Home = () => {
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState();
  const [uploading, setUploading] = useState(false);
  const [getFileUploadUrl, { error }] = useMutation(GET_FILE_UPLOAD_URL);

  const onFileChange = (event) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (fileSelected && fileSelected?.name) {
      // prepare UI
      setUploading(true);
      try {
        const groupName = "the walruses";
        const urlData = await getFileUploadUrl({
          variables: {
            groupName,
          },
        });
        console.log(urlData.data.getFileUploadUrl);

        const { accountName, containerName, sasToken } = urlData.data.getFileUploadUrl;
        // get url for uploading file to Azure blob storage

        // *** UPLOAD TO AZURE STORAGE ***
        await uploadFileToBlob(fileSelected, accountName, containerName, sasToken);
        // reset state/form
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
      }
      setFileSelected(null);
      setFileName("");
      setUploading(false);
    }
  };

  // display form
  const DisplayForm = () => (
    <div>
      <input type="file" onChange={onFileChange} />
      <button type="submit" onClick={onFileUpload}>
        Upload!
      </button>
    </div>
  );

  return (
    <div>
      <h1>Upload file to Azure Blob Storage</h1>
      {!uploading && DisplayForm()}
      {uploading && <div>Uploading</div>}
      <hr />
    </div>
  );
};

export default Home;
