export interface LoginParams {
    identifier: string
    password: string
}

export interface LoginResponse {
    id: string
    username: string
    email: string
    status: string
    verified: boolean
    oauthTypes: string[]
    roles: string[]
    token: Token,
}

export interface Token {
    accessToken: string
    refreshToken: string
}
export interface RefreshTokenParams {
    refreshToken: string
}

