// components/FileManager.tsx
import { File } from "../FileGrid/FileCard";
import FileGrid from "../FileGrid/FileGrid";

const FileManager = () => {
  const mockFiles: File[] = [
    { name: "Document1", type: "apk", size: "2 MB" },
    { name: "Image1", type: "bmp", size: "1.5 MB" },
    { name: "Video1", type: "dmg", size: "25 MB" },
    { name: "Document2", type: "exe", size: "3 MB" },
    { name: "Report", type: "pdf", size: "4 MB" },
    { name: "Photo", type: "image", size: "2.1 MB" },
    { name: "Presentation", type: "ppt", size: "12 MB" },
    { name: "Spreadsheet", type: "xls", size: "5 MB" },
    { name: "CodeFile", type: "js", size: "500 KB" },
    { name: "Config", type: "json", size: "1.2 KB" },
    { name: "Song", type: "mp3", size: "8 MB" },
    { name: "Backup", type: "zip", size: "10 MB" },
    { name: "Ebook", type: "js", size: "3.5 MB" },
    { name: "Design", type: "psd", size: "25 MB" },
    { name: "Archive", type: "rar", size: "15 MB" },
    { name: "Script", type: "exe", size: "3 KB" },
    { name: "Thumbnail", type: "image", size: "800 KB" },
    { name: "VideoClip", type: "mp4", size: "50 MB" },
    { name: "Font", type: "tiff", size: "1 MB" },
    { name: "Log", type: "txt", size: "2 KB" },
  ];

  return <FileGrid files={mockFiles} />;
};

export default FileManager;
