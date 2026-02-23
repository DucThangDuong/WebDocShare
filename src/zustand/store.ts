import { create } from "zustand";
import type { UserProfilePrivate, UserStorageFile } from "../interfaces/UserTypes";
import type { DocumentDetailEdit, FileItem } from "../interfaces/DocumentTypes";

interface StoreState {
  // trạng thái đăng nhập
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  // thông tin user
  user: UserProfilePrivate | null;
  setUser: (user: UserProfilePrivate | null) => void;
  // item nav hiện tại được active
  NavItemActivate: string;
  setNavItemActivate: (item: string) => void;
  // file của user
  files: DocumentDetailEdit[];
  setFiles: (files: DocumentDetailEdit[]) => void;
  // storage file của user
  userStorageFiles: UserStorageFile | null;
  setUserStorageFiles: (userStorageFiles: UserStorageFile) => void;
  //file user muốn up lên server
  fileList: FileItem[];
  setFileList: (fileList: FileItem[]) => void;
  updateFileStatus: (
    id: string,
    status: "uploading" | "success" | "error"
  ) => void;
  //signalR ID connection
  signalRConnectionId: string | null;
  setSignalRConnectionId: (connectionId: string | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  isLogin: false,
  setIsLogin: (isLoginn) => set({ isLogin: isLoginn }),
  user: null,
  setUser: (user) => set({ user }),
  NavItemActivate: "/",
  setNavItemActivate: (item) => set({ NavItemActivate: item }),
  files: [],
  setFiles: (files) => set({ files }),
  userStorageFiles: null,
  setUserStorageFiles: (userStorageFiles) => set({ userStorageFiles }),
  fileList: [],
  setFileList: (fileList) => set({ fileList }),
  updateFileStatus: (id, status) =>
    set((state) => ({
      fileList: state.fileList.map((f) =>
        f.id === id ? { ...f, uploadStatus: status } : f
      ),
    })),

  signalRConnectionId: null,
  setSignalRConnectionId: (connectionId) =>
    set({ signalRConnectionId: connectionId }),
}));
