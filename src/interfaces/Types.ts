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
export interface FileDocument {
  title: string;
  description: string;
  tags: string;
  status: string;
}

export interface FileItem {
  id: string;
  file: File;
  uploadStatus: "pending" | "uploading" | "success" | "error";
  metaData: FileDocument;
}
export interface UserStorageFile {
  storageLimit: number;
  usedStorage: number;
  totalCount: number;
  trash: number;
}
export interface UserProfilePublic {
  id: string;
  username: string;
  fullname: string;
  email: string;
  avatarurl?: string;
}
export interface UserLogin {
  email: string;
  password: string;
}
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}
export interface DocumentInfor {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  sizeInBytes: string;
  status: string;
  createdAt: string;
  fullName: string;
  avatarUrl: string;
  viewCount:number;
  likeCount:number;
  dislikeCount:number;
}
