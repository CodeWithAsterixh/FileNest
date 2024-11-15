// components/FileGrid.tsx
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import FileCard, { File } from "./FileCard";

const FileGrid = ({ files }: { files: File[] }) => {
  return (
    <div className="w-full flex items-start justify-start gap-2 flex-wrap p-2">
      {files.map((file, index) => (
        <FileCard key={index} {...file} />
      ))}
    </div>
  );
};

export default FileGrid;
