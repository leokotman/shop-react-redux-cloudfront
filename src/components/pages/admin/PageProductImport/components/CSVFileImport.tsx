import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (!file) return;

    try {
      // Try to get Cognito ID token first
      let authToken = localStorage.getItem('cognito_id_token');
      let authHeader = '';
      
      if (authToken) {
        authHeader = `Bearer ${authToken}`;
      } else {
        // Fall back to Basic auth token
        const basicToken = localStorage.getItem('authorization_token');
        if (basicToken) {
          authHeader = `Basic ${basicToken}`;
        }
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token exists
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      // Get the presigned URL from the Lambda
      const presignRes = await fetch(
        `${url}?name=${encodeURIComponent(file.name)}`,
        {
          headers,
        }
      );
      if (!presignRes.ok) {
        if (presignRes.status === 401) {
          alert('Unauthorized: Please provide valid credentials. Missing or invalid authorization token.');
        } else if (presignRes.status === 403) {
          alert('Forbidden: Access denied. Invalid credentials provided.');
        } else {
          throw new Error(`Failed to get presigned URL: ${presignRes.status}`);
        }
        return;
      }
      const { url: uploadUrl } = await presignRes.json();
      console.log("Got presigned URL:", uploadUrl);

      // PUT the file to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": "text/csv" },
      });
      if (!uploadRes.ok) {
        throw new Error(`S3 upload failed: ${uploadRes.status}`);
      }
      console.log("File uploaded successfully");
      setFile(undefined);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
