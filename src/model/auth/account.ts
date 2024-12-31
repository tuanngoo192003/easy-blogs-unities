export interface Account {
    id: string
    username?: string
    email?: string
    status?: string
    verified: boolean
    oauthTypes: string[]
    roles: string[],
    generatePassword?: boolean
}