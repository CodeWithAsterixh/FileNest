"use client";

// import { AppDispatch } from "@/store/store";
import FileActions from "@/ui/components/FileActions/FileActions";
import FileManager from "@/ui/components/FileManager/FileManager";
import { useModal } from "@/ui/components/Modal/Modal";
import UploadDialog from "@/ui/components/UploadDialog/UploadDialog";
import { useCallback } from "react";
// import { useDispatch } from "react-redux";

export default function Home() {
  //   const dispatch = useDispatch<AppDispatch>();

  const { openModal, closeModal } = useModal();
  const upload = useCallback((file: File) => {
    // Logic to delete selected files
    console.log(file);
  }, []);

  const handleDelete = useCallback(() => {
    // Logic to delete selected files
    console.log("Delete Files");
  }, []);

  const handleRename = useCallback(() => {
    // Logic to rename a file
    console.log("Rename File");
  }, []);

  const handlePreview = useCallback(() => {
    // Logic to preview a file
    console.log("Preview File");
  }, []);
  return (
    <div className="size-full flex flex-col gap-2 ">
      <FileActions
        onUpload={() => {
          openModal(
            <UploadDialog
              onClose={() => closeModal("uploadFiles")}
              onUpload={upload}
            />,
            { closeOutClick: true },
            "uploadFiles"
          );
        }}
        onDelete={handleDelete}
        onRename={handleRename}
        onPreview={handlePreview}
      />
      <FileManager />
    </div>
  );
}
