import {LoginParams, LoginResponse, RefreshTokenParams} from "./type";
import {AxiosPromise, AxiosResponse} from "axios";
import api from "../../axios";

export const loginApi = (params: LoginParams): Promise<AxiosPromise<LoginResponse>> =>
    api.post('/auth/login', params)

export const refreshTokenApi = (params: RefreshTokenParams): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/refresh', params)