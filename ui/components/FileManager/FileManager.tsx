// components/FileManager.tsx
import FileGrid from "../FileGrid/FileGrid";

const FileManager = () => {
  const mockFiles = [
    { name: "Document1", type: "PDF", size: "2 MB" },
    { name: "Image1", type: "JPEG", size: "1.5 MB" },
    { name: "Video1", type: "MP4", size: "25 MB" },
    { name: "Document2", type: "DOCX", size: "3 MB" },
  ];

  return <FileGrid files={mockFiles} />;
};

export default FileManager;
