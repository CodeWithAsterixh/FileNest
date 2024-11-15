import { openDB } from "idb";

const DB_NAME = "FileNestDB";
const DB_VERSION = 1;
const FILE_STORE_NAME = "files";

// Open IndexedDB
const openDatabase = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the object store if it doesn't exist
      if (!db.objectStoreNames.contains(FILE_STORE_NAME)) {
        const store = db.createObjectStore(FILE_STORE_NAME, {
          keyPath: "id", // File ID as the key
          autoIncrement: true,
        });
        store.createIndex("name", "name"); // Index by file name
      }
    },
  });
  return db;
};

// Store file in IndexedDB
export const storeFile = async (file: File) => {
  const db = await openDatabase();
  const tx = db.transaction(FILE_STORE_NAME, "readwrite");
  const store = tx.objectStore(FILE_STORE_NAME);
  const fileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    content: file, // The file content will be stored here (use .slice() for large files)
  };
  await store.add(fileData);
  await tx.done;
};

// Get all files from IndexedDB
export const getAllFiles = async () => {
  const db = await openDatabase();
  const tx = db.transaction(FILE_STORE_NAME, "readonly");
  const store = tx.objectStore(FILE_STORE_NAME);
  const files = await store.getAll();
  await tx.done;
  return files;
};

// Delete file by ID
export const deleteFile = async (id: number) => {
  const db = await openDatabase();
  const tx = db.transaction(FILE_STORE_NAME, "readwrite");
  const store = tx.objectStore(FILE_STORE_NAME);
  await store.delete(id);
  await tx.done;
};
