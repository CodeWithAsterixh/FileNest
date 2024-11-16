"use client";

// components/FileGrid.tsx
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import FileCard, { File } from "./FileCard";
import { useCallback, useEffect, useState } from "react";

export type fileGridType = {
  files?: File[];
  selectable?: boolean;
  onSelectItem?: (files: File[]) => void;
};
const FileGrid = ({
  files,
  selectable = false,
  onSelectItem,
}: fileGridType) => {
  const [selected, setSelected] = useState<File[]>([]);
  useEffect(() => {
    if (onSelectItem) {
      onSelectItem(selected);
    }
  }, [selected]);
  useEffect(() => {
    if (!selectable) {
      setSelected([]);

    }
  }, [selectable]);
  const handleSelection = useCallback(
    (file: File) => {
      const isSelected = selected.find((f) => f.name === file.name);
      if (!isSelected) {
        setSelected((f) => [...f, file]);
      } else {
        const filter = selected.filter((f) => f.name !== file.name);
        setSelected(filter);
      }
    },
    [selected]
  );

  return (
    <div className="w-full flex items-start justify-start gap-2 flex-wrap p-2">
      {files &&
        files.map((file, index) => (
          <FileCard
            key={index}
            {...file}
            select={{
              selectable,
              onSelected(file) {
                handleSelection(file);
              },
              selected:
                selected.find((f) => f.name === file.name) && selectable
                  ? true
                  : false,
            }}
          />
        ))}
    </div>
  );
};

export default FileGrid;
