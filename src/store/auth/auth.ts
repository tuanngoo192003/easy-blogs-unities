import {defineStore} from "pinia";
import {Account} from "../../model/auth/account";
import {Cookies} from "quasar";
import {ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER} from "../../constant/storage";
import {LoginParams, LoginResponse} from "../../api/auth/login/type";
import {loginApi} from "../../api/auth/login";
import {REDIRECT_USER} from "../../constant/roles";
import {mappingAccountFromLoginResponse} from "../../model/hook/auth";
import CryptoJS from "crypto-js/core";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

interface State {
    loginError: boolean
    changePasswordError: boolean
    rootUrl: string
    currentAccount: Account
}

export const useAuthStore = defineStore('auth',{
    state: (): State => ({
        loginError: false,
        changePasswordError: false,
        rootUrl: '/',
        currentAccount: {
            id: '',
            username: '',
            email: '',
            roles: [],
            verified: false,
            oauthTypes: [],
        },
    }),
    getters: {
        isLogin: (state) => !!state.currentAccount.id,
    },
    actions: {
        async login(params: LoginParams) {
            try {
                this.loginLoading = true
                this.loginError = false
                const { data } = await loginApi(params)
                await this.loginSuccessfully(data)
            } catch (e) {
                this.loginError = true
            } finally {
                this.loginLoading = false
            }
        },
        logout() {
            Cookies.remove(ACCESS_TOKEN_KEY)
            Cookies.remove(REFRESH_TOKEN_KEY)
            Cookies.remove(USER)
            localStorage.setItem("logout-event", Date.now().toString())
            this.$reset()
            window.location.replace('/')
        },
        async loginSuccessfully(loginResp: LoginResponse) {
            localStorage.setItem("login-event", Date.now().toString())
            this.currentAccount = mappingAccountFromLoginResponse(loginResp)
            const userString = JSON.stringify(this.currentAccount)
            Cookies.set(USER, CryptoJS.AES.encrypt(userString, SECRET_KEY).toString())
            if (loginResp.verified) {
                Cookies.set(ACCESS_TOKEN_KEY, loginResp.token.accessToken)
                Cookies.set(REFRESH_TOKEN_KEY, loginResp.token.refreshToken)
            }
            window.location.replace(REDIRECT_USER(this.currentAccount.roles[0]))
        },
        deserializeUserInfo(){
            const userInfo = Cookies.get(USER)
            if(userInfo){
                const bytes = CryptoJS.AES.decrypt(userInfo, SECRET_KEY)
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
                this.currentAccount = JSON.parse(decryptedData)
            }
        },
    }
})