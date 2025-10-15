import React, { useState, useRef } from 'react';
// 1. MISTAKE CORRECTED: Import Uploader from 'upload-js' (or your installed package name)
import { Uploader } from 'upload-js'; 

// ----------------------------------------------------------------------
// 2. Initialize the Uploader (No changes needed here)
// ----------------------------------------------------------------------
const uploader =Uploader({
  apiKey: "public_kW2K8bpEsqn9M2xQPBKBqvsNj8zL" // <--- REPLACE THIS
});
                                                                                                                                             
// Optional: Define upload options for images only
const uploadOptions = {
  // Enforce image-only uploads at the SDK level
  mimeTypes: ["image/jpeg", "image/png", "image/webp"], 
  maxFileCount: 1, // Limiting to one file for a simple button flow
  // You can add other options here like tags, path, etc.
};

const CustomImageUploader = () => {
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null); // Ref for triggering the hidden file input

  // Function to handle the file selection and upload process
  const handleFileChange = async (event) => {
    // Get the first file from the input selection
    alert("$")
    const file = event.target.files[0];
    
    if (!file) {
      return; // No file selected, exit
    }

    // Client-side validation to enforce image type (Good practice!)
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG, PNG, or WebP).');
        // Clear the file input so the user can select the same file again if needed
        event.target.value = ''; 
        return; 
    }

    setIsUploading(true);
    setUploadedFileUrl(null); // Clear previous URL

    try {
      // 3. CORE CHANGE: Use the uploader.upload() method with the raw File object
      const [uploadedFile] = await uploader.upload({
        files: [file],
        options: uploadOptions,
      });

      if (uploadedFile) {
        setUploadedFileUrl(uploadedFile.fileUrl);
        console.log("Upload Complete. File URL:", uploadedFile.fileUrl);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Optional: Reset file input to allow re-uploading the same file
      event.target.value = ''; 
    }
  };

  // Function to programmatically trigger the hidden file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
      <h3>Custom Image Uploader</h3>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        // Force the browser file selector to show only images
        accept={uploadOptions.mimeTypes.join(',')} 
        style={{ display: 'none' }} 
      />

      {/* Custom Button to trigger the file input */}
      <button
        onClick={triggerFileInput}
        disabled={isUploading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: isUploading ? '#ccc' : '#377dff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: isUploading ? 'not-allowed' : 'pointer'
        }}
      >
        {isUploading ? 'Uploading Image...' : 'Select & Upload Image'}
      </button>

      {/* Display result/status */}
      {isUploading && <p style={{ marginTop: '15px', color: '#377dff' }}>Processing upload...</p>}
      
      {uploadedFileUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Upload Success!</h4>
          <img 
            src={uploadedFileUrl} 
            alt="Uploaded Preview" 
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', borderRadius: '4px', border: '1px solid #eee' }} 
          />
          <p style={{ fontSize: '0.8em', wordBreak: 'break-all' }}>
            <a href={uploadedFileUrl} target="_blank" rel="noopener noreferrer">{uploadedFileUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomImageUploader;
