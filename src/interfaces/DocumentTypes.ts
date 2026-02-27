export interface FileDocument {
    title: string;
    description: string;
    tags: string[];
    status: string;
    universityId: number | null;
    universitySectionId: number | null;
}

export interface FileItem {
    id: string;
    file: File;
    uploadStatus: "pending" | "uploading" | "success" | "error";
    metaData: FileDocument;
}

export interface DocumentInfor {
    id: string;
    uploaderId: number;
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
    universityId: number | null;
    universitySectionId: number | null;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
    count: number;
}
