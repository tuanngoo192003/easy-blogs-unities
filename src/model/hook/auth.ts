import {LoginResponse} from "../../api/auth/login/type";
import {Account} from "../auth/account";

export function mappingAccountFromLoginResponse(loginResp: LoginResponse): Account {
    return {
        id: loginResp.id,
        username: loginResp.username,
        email: loginResp.email,
        status: loginResp.status,
        verified: loginResp.verified,
        oauthTypes: loginResp.oauthTypes,
        roles: loginResp.roles
    }
}