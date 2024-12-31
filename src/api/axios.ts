import axios from "axios";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER} from "../constant/storage";
import {Cookies} from "quasar";
import {useAuthStore} from "../store/auth/auth";
import {RefreshTokenParams} from "./auth/login/type";
import {refreshTokenApi} from "./auth/login";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
});

interface ExpiredTokenRequest {
    resolve: (value?: unknown | PromiseLike<unknown>) => void
    reject: (error: unknown) => unknown
}

let refreshingToken = false
let expiredTokenRequests: ExpiredTokenRequest[] = []

const processExpiredTokenRequests = (error: unknown) => {
    expiredTokenRequests.forEach((req) => {
        if (error) {
            req.reject(error)
        } else {
            req.resolve()
        }
    })
    expiredTokenRequests = []
}

const publicUrls = [/\/auth\/login/, /\/auth\/refresh/, /\/auth\/register/, /\/public\/.*/]

api.interceptors.request.use((config) => {
    const accessToken = Cookies.get(ACCESS_TOKEN_KEY)
    if (accessToken && !publicUrls.some((pattern) => pattern.test(config.url || ''))) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const authStore = useAuthStore()
        const status = error.response?.status
        switch (status) {
            case 401: {
                if (error.config.url?.includes('/auth/login')) {
                    break
                }
                const config = error.config
                if (!error.config.url?.includes('/auth/refresh') && !config._retry) {
                    if (refreshingToken) {
                        try {
                            await new Promise((resolve, reject) => {
                                expiredTokenRequests.push({ resolve, reject })
                            })
                            return api(config)
                        } catch (error) {
                            return Promise.reject(error)
                        }
                    }

                    config._retry = true

                    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY)
                    if (!refreshToken) {
                        return authStore.logout()
                    }
                    if (!refreshingToken) {
                        try {
                            refreshingToken = true
                            const tokenParams = {
                                refreshToken
                            } as RefreshTokenParams
                            const { data } = await refreshTokenApi(tokenParams)
                            Cookies.set(ACCESS_TOKEN_KEY, data.token.accessToken)
                            Cookies.set(REFRESH_TOKEN_KEY, data.token.refreshToken)
                            processExpiredTokenRequests(null)
                            return api(config)
                        } catch (e) {
                            processExpiredTokenRequests(e)
                            return authStore.logout()
                        } finally {
                            refreshingToken = false
                        }
                    }
                }
                break
            }
            case 403:
                Cookies.remove(ACCESS_TOKEN_KEY)
                Cookies.remove(REFRESH_TOKEN_KEY)
                Cookies.remove(USER)
                window.location.replace('/403')
                break
            case 404:
                window.location.replace('/404')
                break
            case 500:
                window.location.replace('/500')
                break
            default:
                break
        }
    }
)

export default api