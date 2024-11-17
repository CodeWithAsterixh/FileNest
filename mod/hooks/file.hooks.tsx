import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { selectItems_schema } from "../pages_schemas/page.schema";
import { File as FileCardType } from "@/ui/components/FileGrid/FileCard";
import { useModal } from "@/ui/components/Modal/Modal";
import SimpleDialog from "@/ui/components/SimpleDialog/SimpleDialog";
import UploadDialog from "@/ui/components/UploadDialog/UploadDialog";

export function useFileSelect() {
  const [selectItems, setSelectItems] = useState<selectItems_schema>({
    selectable: false,
    selected: [],
  });
  const handleUnSelect = useCallback(() => {
    setSelectItems({
      selected: [],
      selectable: false,
    });
  }, [selectItems.selectable]);
  const handleSelect = useCallback(() => {
    setSelectItems((s) => ({
      ...s,
      selectable: true,
    }));
  }, [selectItems.selectable]);
  const handleSetSelection = useCallback(
    (items: FileCardType[]) => {
      setSelectItems((s) => ({ ...s, selected: items }));
    },
    [selectItems.selected]
  );
  return {
    selectItems,
    handleUnSelect,
    handleSelect,
    handleSetSelection,
  };
}

export function useFileDelete(
  selected: FileCardType[],
  mainFiles: FileCardType[],
  setHeadUpdate?: Dispatch<SetStateAction<FileCardType[]>>
) {
  const { openModal, closeModal } = useModal();
  const [update, setUpdate] = useState<FileCardType[]>([]);

  const handleDelete = useCallback(() => {
    openModal(
      <SimpleDialog
        onAccept={() => {
          const deleted = mainFiles.filter(
            (main) => !selected.some((selected) => main.name === selected.name)
          );
          setUpdate(deleted);
          if (setHeadUpdate) {
            setHeadUpdate(deleted);
          }
        }}
        title={`Delete ${selected.length} files`}
        onClose={() => closeModal("deleteDialog")}
        question="Do you want to delete these files?"
      />,
      {},
      "deleteDialog"
    );
  }, [selected]);
  return {
    handleDelete,
    update,
  };
}

export function useFileRename() {
  const handleRename = useCallback(() => {
    console.log("renaming");
  }, []);
  return {
    handleRename,
  };
}
export function useFilePreview() {
  const handlePreview = useCallback(() => {
    // Logic to preview a file
    console.log("Preview File");
  }, []);
  return {
    handlePreview,
  };
}

export function useFileUpload() {
  const { openModal, closeModal } = useModal();
  const [process, setProcess] = useState<{
    success: number;
    message: string;
    process: "processing" | "done" | "notStarted";
  }>({
    success: 0,
    message: "",
    process: "notStarted",
  });
  const upload = useCallback((file: File) => {
    // Logic to delete selected files
    console.log(file);
  }, []);

  const handleUpload = useCallback(() => {
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
  }, []);
  return {
    handleUpload,
    process,
  };
}

export function useFile(
  files: FileCardType[],
  setFiles: Dispatch<SetStateAction<FileCardType[]>>
) {
  const fileSelect = useFileSelect();
  const fileDelete = useFileDelete(
    fileSelect.selectItems.selected,
    files,
    setFiles
  );
  const fileRename = useFileRename();
  const filePreview = useFilePreview();
  const fileUpload = useFileUpload();
  return {
    fileSelect,
    fileDelete,
    fileRename,
    fileUpload,
    filePreview,
  };
}
