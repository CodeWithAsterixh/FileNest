import React from "react";
import { AppBar, Toolbar, IconButton, Tooltip } from "@mui/material";
import { MdDelete, MdEdit, MdUploadFile, MdVisibility } from "react-icons/md";

interface FileActionsProps {
  onUpload: () => void;
  onDelete: () => void;
  onRename: () => void;
  onPreview: () => void;
}

const FileActions: React.FC<FileActionsProps> = ({
  onUpload,
  onDelete,
  onRename,
  onPreview,
}) => {
  return (
    <AppBar
      position="sticky"
      className="top-14 !z-0 !bg-neutral-200 dark:!bg-black"
    >
      <Toolbar>
        <Tooltip title="Upload Files">
          <IconButton color="primary" onClick={onUpload}>
            <MdUploadFile />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Files">
          <IconButton color="error" onClick={onDelete}>
            <MdDelete />
          </IconButton>
        </Tooltip>

        <Tooltip title="Rename File">
          <IconButton color="secondary" onClick={onRename}>
            <MdEdit />
          </IconButton>
        </Tooltip>

        <Tooltip title="Preview File">
          <IconButton color="info" onClick={onPreview}>
            <MdVisibility />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default FileActions;
