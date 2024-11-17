"use client";

// import { AppDispatch } from "@/store/store";
import { useFile } from "@/mod/hooks/file.hooks";
import FileActions from "@/ui/components/FileActions/FileActions";
import { File } from "@/ui/components/FileGrid/FileCard";
import FileManager from "@/ui/components/FileManager/FileManager";
import { mockFiles } from "@/ui/components/FileManager/MockFiles";
import { useCallback, useEffect, useState } from "react";
// import { useDispatch } from "react-redux";

export default function Home() {
  //   const dispatch = useDispatch<AppDispatch>();
  const [files, setFiles] = useState<File[]>([]);

  const { fileDelete, fileRename, fileSelect, fileUpload, filePreview } =
    useFile(files, setFiles);

  useEffect(() => {
    setFiles(mockFiles);
  }, []);
  useEffect(() => {
    fileSelect.handleUnSelect();
  }, [files]);

  return (
    <div className="size-full flex flex-col gap-2 ">
      <FileActions
        onUpload={fileUpload.handleUpload}
        onDelete={
          fileSelect.selectItems.selectable &&
          fileSelect.selectItems.selected.length > 0
            ? fileDelete.handleDelete
            : undefined
        }
        onRename={
          fileSelect.selectItems.selectable &&
          fileSelect.selectItems.selected.length > 0
            ? fileRename.handleRename
            : undefined
        }
        onPreview={
          fileSelect.selectItems.selectable &&
          fileSelect.selectItems.selected.length > 0
            ? filePreview.handlePreview
            : undefined
        }
        handleSelect={fileSelect.handleSelect}
        handleUnselect={
          fileSelect.selectItems.selectable
            ? fileSelect.handleUnSelect
            : undefined
        }
      />
      <FileManager
        selectable={fileSelect.selectItems.selectable}
        onSelectItem={fileSelect.handleSetSelection}
        files={files}
      />
    </div>
  );
}
