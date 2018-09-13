export interface JwtPayload {
    id: string;
    options?: any;
}

export interface JwtReply {
    accessToken: string;
    expiresIn: number;
}
