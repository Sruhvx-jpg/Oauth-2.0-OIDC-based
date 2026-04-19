import axios from "axios"
import apiError from "../utils/api_error"

class OauthService{
    constructor(){
        this.metadata = null
    }

    async getEndPoints() {
        if(this.metadata) return this.metadata

        try {
            const response = await axios.get(process.env.DIS_URL)
            this.metadata = {
                auth: response.data.authorization_endpoint,
                token: response.data.token_endpoint,
                userInfo: response.data.userinfo_endpoint
            }

            return this.metadata
        } catch (error) {
            throw apiError.EPE()
        }
    }

    async generateAuthUrl(){
        const endpoints = await this.getEndPoints()
        const params =  new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'consent'
        })

        return `${endpoints.auth}?${params}`
    }

    async tokenExchange(tempToken) {
        const endpoints = await this.getEndPoints();

        const response = await axios.post(endpoints.token, {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: process.env.REDIRECT_URI,
            code: tempToken
        })

        return response.data
    }

    async getUserData(accessToken) {
        const endpoints = await this.getEndPoints()
        const response = await axios.get(endpoints.userInfo, {
            headers: { Authorization: `Bearer ${accessToken}`}
        })

        return response.data
    }
}



export default OauthService