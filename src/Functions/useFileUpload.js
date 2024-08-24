/* eslint-disable no-unused-vars */
// src/hooks/useFileUpload.js

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uniqueId } from 'uuid';
import { addFile } from '../Redux/ReducersAction';
import { uploadFilesSave } from './DB';
import { processing } from './processReturn';

export function useFileUpload(password) {
  const dispatch = useDispatch();
  const [uploadProcess, setUploadProcess] = useState({ process: 0, size: 0 });

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setUploadProcess({ process: 1, size: files.length });

    processing.loading('loading file', 'fileUpload')

    const fileArray = await Promise.all(
      Array.from(files).map(async (file, index) => {
        const { name, size, type } = file;
        const fileSize = (size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert size to MB
        const fileExtension = name.split('.').pop().toLowerCase(); // Get the file extension
        const uploadDate = new Date().toISOString();
        const fileId =  uniqueId()
        const preview = await generatePreview(fileExtension, file); // Generate a preview URL for images
        processing.loading('loading file', 'fileUpload')
        await uploadFilesSave({ blob: file, fileName: name,
          fileType: `.${fileExtension}`,
          type,
          fileSize,
          uploadDate,
          modifiedDate: uploadDate,
          filePath: fileId, // Store the Blob as the file path
          preview,
          tags: [],
          description: '',
          id: fileId }, password);
        setUploadProcess({ process: 2, size: index + 1 });
        processing.loading('uploading file', 'fileUpload')
          return {
          fileName: name,
          fileType: `.${fileExtension}`,
          type,
          fileSize,
          uploadDate,
          modifiedDate: uploadDate,
          filePath: fileId, // Store the Blob as the file path
          preview,
          tags: [],
          description: '',
          id: fileId,
          };

      })
    );
    processing.success('file uploaded', 'fileUpload')

    setUploadProcess({ process: 3, size: fileArray.length });
    setTimeout(() => {
      processing.clear()
    }, 2000);

    fileArray.forEach(async (file) => {
      dispatch(addFile({ file, password }));
    });
  };

  const generatePreview = (fileExtension, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
          resolve(reader.result); // Image file - return dataURL
        } else if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension)) {
          resolve('/path/to/video-icon.png'); // Use a default video icon
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension)) {
          resolve('/path/to/document-icon.png'); // Use a default document icon
        } else {
          resolve('/path/to/file-icon.png'); // Use a default file icon
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    });
  };

 const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      view[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeString });
  };

  return { uploadProcess, handleFileChange };
}
