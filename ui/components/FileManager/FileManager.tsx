// components/FileManager.tsx
import { File } from "../FileGrid/FileCard";
import FileGrid, { fileGridType } from "../FileGrid/FileGrid";

const FileManager = (props?: fileGridType) => {
  return <FileGrid {...props} />;
};

export default FileManager;
