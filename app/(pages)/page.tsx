"use client";

// import { AppDispatch } from "@/store/store";
import FileActions from "@/ui/components/FileActions/FileActions";
import { File as FileCardType } from "@/ui/components/FileGrid/FileCard";
import FileManager from "@/ui/components/FileManager/FileManager";
import { useModal } from "@/ui/components/Modal/Modal";
import UploadDialog from "@/ui/components/UploadDialog/UploadDialog";
import { useCallback, useEffect, useState } from "react";
// import { useDispatch } from "react-redux";

export default function Home() {
  //   const dispatch = useDispatch<AppDispatch>();
  const [selectItems, setSelectItems] = useState<{
    selectable: boolean;
    selected: FileCardType[];
  }>({
    selectable: false,
    selected: [],
  });

  const { openModal, closeModal } = useModal();
  const upload = useCallback((file: File) => {
    // Logic to delete selected files
    console.log(file);
  }, []);

  const handleDelete = useCallback(() => {
    console.log("Delete Files");
  }, [selectItems.selectable]);
  const handleSelect = useCallback(() => {
    // Logic to delete selected files
    if (!selectItems.selectable) {
      setSelectItems((s) => ({
        ...s,
        selectable: true,
      }));
    } else {
      setSelectItems({
        selected: [],
        selectable: false,
      });
    }
  }, [selectItems.selectable]);
  useEffect(() => {
    console.log(selectItems);
  }, [selectItems]);

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
            {
              closeOutClick: true,
              boxStyles: "!bg-neutral-100 dark:!bg-neutral-900",
            },
            "uploadFiles"
          );
        }}
        onDelete={selectItems.selectable ? handleDelete : undefined}
        onRename={handleRename}
        onPreview={handlePreview}
        handleSelect={handleSelect}
      />
      <FileManager
        selectable={selectItems.selectable}
        onSelectItem={(items) => {
          setSelectItems((s) => ({ ...s, selected: items }));
        }}
      />
    </div>
  );
}
