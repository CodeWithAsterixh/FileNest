"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface SimpleDialogProps {
  title?: string;
  question?: string;
  onAccept?: () => void;
  onReject?: () => void;
  onClose?: () => void;
}

const SimpleDialog: React.FC<SimpleDialogProps> = ({
  title,
  question = "Are you sure about this action?",
  onAccept,
  onReject,
  onClose,
}) => {
  return (
    <div className="w-full p-3 !text-neutral-900 dark:!text-neutral-100">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className="w-full h-fit p-2 flex items-center justify-center">
        <Typography variant="body2" className="!text-center">
          {question}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          className="!border-red-500 !text-red-500"
          onClick={() => {
            if (onReject) {
              onReject();
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          className="!bg-blue-500 !text-white"
          onClick={() => {
            if (onAccept) {
              onAccept();
            }
            if (onClose) {
              onClose();
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
};

export default SimpleDialog;
