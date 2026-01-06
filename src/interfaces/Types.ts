import type { ReactNode } from "react";

export interface FileData {
  id: string;
  title: string;
  createdAt: string;
  sizeInBytes: string;
  type: "pdf" | "image" | "excel";
}

export interface LayoutProps {
  children: ReactNode;
}
export interface FileMetaData {
  title: string;
  description: string;
  tags: string;
  status: string;
}

export interface FileItem {
  id: string;
  file: File;
  progress: number;
  metaData: FileMetaData; 
}
export interface UserStorageFile{
  storageLimit: number;
  usedStorage: number;
  totalCount: number;
  trash: number;
}