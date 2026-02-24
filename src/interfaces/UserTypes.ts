export interface UserProfilePublic {
    id: number;
    username: string;
    fullname: string;
    email: string;
    avatarUrl?: string;
    universityId?: number;
    universityName?: string;
    followerCount: number;
    isFollowing: boolean;
}

export interface UserProfilePrivate extends UserProfilePublic {
    email: string;
    storagelimit: number;
    usedstorage: number;
    hasPassword: boolean;
    followingCount: number;
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

export interface UserUpdate {
    fullname?: string;
    avatar?: FormData;
    email?: string;
    password?: string;
}

export interface UserStorageFile {
    storageLimit: number;
    usedStorage: number;
    totalCount: number;
    trash: number;
}

export interface ResUserStatsDto {
    uploadCount: number;
    savedCount: number;
    totalLikesReceived: number;
}
