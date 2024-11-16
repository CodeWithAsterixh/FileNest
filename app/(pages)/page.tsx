"use client";

// import { AppDispatch } from "@/store/store";
import FileActions from "@/ui/components/FileActions/FileActions";
import { File as FileCardType } from "@/ui/components/FileGrid/FileCard";
import FileManager from "@/ui/components/FileManager/FileManager";
import { mockFiles } from "@/ui/components/FileManager/MockFiles";
import { useModal } from "@/ui/components/Modal/Modal";
import SimpleDialog from "@/ui/components/SimpleDialog/SimpleDialog";
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
  const [files, setFiles] = useState<FileCardType[]>([]);
  useEffect(() => {
    setFiles(mockFiles);
  }, []);

  const { openModal, closeModal } = useModal();
  const upload = useCallback((file: File) => {
    // Logic to delete selected files
    console.log(file);
  }, []);

  const handleSelect = useCallback(() => {
    setSelectItems((s) => ({
      ...s,
      selectable: true,
    }));
  }, [selectItems.selectable]);
  const handleUnSelect = useCallback(() => {
    setSelectItems({
      selected: [],
      selectable: false,
    });
  }, [selectItems.selectable]);
  const handleDelete = useCallback(() => {
    console.log("Delete Files");
    openModal(
      <SimpleDialog
        onAccept={() => {
          const deleted = files.filter(
            (main) =>
              !selectItems.selected.some(
                (selected) => main.name === selected.name
              )
          );
          setFiles(deleted);
          handleUnSelect();
        }}
        title={`Delete ${selectItems.selected.length} files`}
        onClose={() => closeModal("deleteDialog")}
        question="Do you want to delete these files?"
      />,
      {},
      "deleteDialog"
    );
  }, [selectItems.selected]);
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
        onDelete={
          selectItems.selectable && selectItems.selected.length > 0
            ? handleDelete
            : undefined
        }
        onRename={
          selectItems.selectable && selectItems.selected.length > 0
            ? handleRename
            : undefined
        }
        onPreview={
          selectItems.selectable && selectItems.selected.length > 0
            ? handlePreview
            : undefined
        }
        handleSelect={handleSelect}
        handleUnselect={selectItems.selectable ? handleUnSelect : undefined}
      />
      <FileManager
        selectable={selectItems.selectable}
        onSelectItem={(items) => {
          setSelectItems((s) => ({ ...s, selected: items }));
        }}
        files={files}
      />
    </div>
  );
}
