import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { uploadFileToBlob } from "../utils/uploadFileToBlob";
import { GENERATE_FILE_UPLOAD_URL } from "../utils/mutations";
const Home = () => {
  const [fileName, setFileName] = useState("");
  const [fileSelected, setFileSelected] = useState();
  const [uploading, setUploading] = useState(false);
  const [generateFileUploadUrl, { error }] = useMutation(GENERATE_FILE_UPLOAD_URL);
  const onFileChange = (event) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    if (fileSelected && fileSelected?.name) {
      // prepare UI
      setUploading(true);

      // *** UPLOAD TO AZURE STORAGE ***
      await uploadFileToBlob(fileSelected, fileUploadUrl);
      // reset state/form
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
