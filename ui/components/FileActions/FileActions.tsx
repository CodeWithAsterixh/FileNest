import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { MdDelete, MdEdit, MdUploadFile, MdVisibility } from "react-icons/md";
import { GiSelect } from "react-icons/gi";

interface FileActionsProps {
  onUpload?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  onPreview?: () => void;
  handleSelect?: () => void;
}

const FileActions: React.FC<FileActionsProps> = ({
  onUpload,
  onDelete,
  onRename,
  onPreview,
  handleSelect,
}) => {
  return (
    <AppBar
      position="sticky"
      className="top-14 !z-0 !bg-neutral-200 dark:!bg-black"
    >
      <Toolbar className="!flex justify-between flex-wrap min-[300px]:flex-nowrap items-center">
        <div className="w-full flex flex-wrap gap-2">
          <Tooltip title="Upload Files">
            <IconButton color="primary" onClick={onUpload}>
              <MdUploadFile />
            </IconButton>
          </Tooltip>

          {onDelete && (
            <Tooltip title="Delete Files">
              <IconButton color="error" onClick={onDelete}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          )}

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
        </div>
        <Tooltip title="Select">
          <IconButton
            color="info"
            className="!rounded-none"
            onClick={handleSelect}
          >
            <Typography variant="caption" component="strong">
              Select
            </Typography>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default FileActions;
