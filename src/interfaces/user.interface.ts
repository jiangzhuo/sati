export interface UserInfoData {
    userId: string;
    nickname: string;
    mobile: string;
    status: number;
    updateTime: number;
}

export interface CreateUserInput {
    nickname: string;
    mobile: string;
    password: string;
    verificationCode: number;
    status?: number;
}

export interface UpdateUserInput {
    nickname?: string;
    password?: string;
}
