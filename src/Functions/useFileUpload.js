// src/hooks/useFileUpload.js

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uniqueId } from 'uuid';
import { addFile } from '../Redux/ReducersAction';
import { uploadFilesSave } from './DB';

export function useFileUpload(password) {
  const dispatch = useDispatch();
  const [uploadProcess, setUploadProcess] = useState({ process: 0, size: 0 });
    
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setUploadProcess({ process: 1, size: files.length });

    const fileArray = await Promise.all(Array.from(files).map(async (file, index) => {
      const { name, size, type } = file;
      const fileSize = (size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert size to MB
      const fileExtension = name.split('.').pop().toLowerCase(); // Get the file extension
      const uploadDate = new Date().toISOString();
      const filePath = URL.createObjectURL(file); // Use a temporary URL for the file
      const preview = await generatePreview(fileExtension, file); // Generate a preview URL or icon

      setUploadProcess({ process: 2, size: index + 1 });

      return {
        fileName: name,
        fileType: `.${fileExtension}`,
        type,
        fileSize,
        uploadDate,
        filePath,
        preview,
        tags: [],
        description: '',
        id: uniqueId(),
      };
    }));

    setUploadProcess({ process: 3, size: fileArray.length });
    fileArray.forEach(async file => {
      dispatch(addFile({ file, password }));
      // Encrypt and save the file in the database
      await uploadFilesSave(file, password);
    });
  };

  const generatePreview = (fileExtension, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
          resolve(reader.result);
        } else if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(fileExtension)) {
          resolve('/path/to/video-icon.png');
        } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExtension)) {
          resolve('/path/to/document-icon.png');
        } else {
          resolve('/path/to/file-icon.png');
        }
      };

      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };

      reader.readAsDataURL(file);
    });
  };

  return { uploadProcess, handleFileChange };
}
