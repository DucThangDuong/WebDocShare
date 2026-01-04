import type { ReactNode } from "react";

export interface FileData {
  id: string;
  name: string;
  date: string;
  size: string;
  type: "pdf" | "image" | "excel";
}

export interface RecentFile {
  id: string;
  name: string;
  actionTime: string;
  type: "pdf" | "image" | "excel";
}
export interface LayoutProps {
  children: ReactNode;
}
