export enum Role {
    SYSTEM_ADMIN = 'SYSTEM_ADMIN',
    BLOGGER = 'BLOGGER',
    GUEST = 'GUEST',
}

export function REDIRECT_USER(role: string) {
    switch (role) {
        case Role.SYSTEM_ADMIN:
            return `/panel/system-admin-dashboard`
        case Role.BLOGGER:
            return `/panel/organization-dashboard`
        case Role.GUEST:
            return `/panel/member-organization-dashboard`
        default:
            return `/home`
    }
}