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
  handleUnselect?: () => void;
}

const FileActions: React.FC<FileActionsProps> = ({
  onUpload,
  onDelete,
  onRename,
  onPreview,
  handleSelect,
  handleUnselect,
}) => {
  return (
    <AppBar
      position="sticky"
      className="!top-14 !z-[1] !bg-neutral-200 dark:!bg-black"
    >
      <Toolbar className="!px-2 !flex justify-between flex-wrap min-[300px]:flex-nowrap items-center">
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

          {onRename && (
            <Tooltip title="Rename File">
              <IconButton color="secondary" onClick={onRename}>
                <MdEdit />
              </IconButton>
            </Tooltip>
          )}

          {onPreview && (
            <Tooltip title="Preview File">
              <IconButton color="info" onClick={onPreview}>
                <MdVisibility />
              </IconButton>
            </Tooltip>
          )}
        </div>
        {handleUnselect && (
          <Tooltip title="Select">
            <IconButton
              color="info"
              className="!rounded-none"
              onClick={handleUnselect}
            >
              <Typography variant="body2" component="strong">
                cancel
              </Typography>
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Select">
          <IconButton
            color="info"
            className="!rounded-none"
            onClick={handleSelect}
          >
            <Typography variant="body2" component="strong">
              Select
            </Typography>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default FileActions;
