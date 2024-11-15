import { FileIn } from "@/store/reducers/fileTypes";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

interface UploadDialogProps {
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      if (!selectedFile) return;

      // Example custom file data structure
      const fileData: FileIn = {
        id: "1",
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        content: selectedFile,
      };

      // Convert the custom file object to a File instance
      const createFileFromData = (fileData: FileIn): File => {
        const blob = new Blob([fileData.content || ""], {
          type: fileData.type,
        });
        return new File([blob], fileData.name, { type: fileData.type });
      };

      const actualFile = createFileFromData(fileData);

      onUpload(actualFile);

      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <DialogTitle>Upload File</DialogTitle>
      <DialogContent>
        <TextField
          type="file"
          fullWidth
          onChange={handleFileChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" disabled={!selectedFile}>
          Upload
        </Button>
      </DialogActions>
    </Box>
  );
};

export default UploadDialog;
