import type { ReactNode } from "react";


export interface LayoutProps {
  children: ReactNode;
}
export interface FileDocument {
  title: string;
  description: string;
  tags: string[];
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
  avatarUrl?: string;
}
export interface UserProfilePrivate extends UserProfilePublic {
  email: string;
  storagelimit: number;
  usedstorage: number;
}
export interface UserLogin {
  email: string;
  password: string;
}
export interface UserRegister {
  fullname: string;
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
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean | null;
  isSaved: boolean | null;
  thumbnail: string | null;
  pageCount: number;
  tags: string[] | null;
}
export interface DocumentSummary {
  id: string;
  title: string;
  createdAt: string;
  thumbnail: string | null;
  pageCount: number;
  tags: string[] | null;
  likeCount: number;
}
export interface DocumentDetailEdit {
  id: string;
  title: string;
  createdAt: string;
  thumbnail: string | null;
  pageCount: number;
  tags: string[] | null;
  description: string;
  sizeInBytes: string;
  status: string;
  fileUrl: string;
  updatedAt: string;
}
export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}
export class ApiError extends Error {
  status: number;
  data: object | undefined;

  constructor(status: number, message: string, data?: object) {
    super(message);
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
export interface UserUpdate {
  fullname?: string;
  avatar?: FormData;
  email?: string;
  password?: string;
}
export interface ResUserStatsDto {
  uploadCount: number;
  savedCount: number;
  totalLikesReceived: number;
}