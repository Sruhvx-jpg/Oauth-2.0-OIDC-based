import axios from "axios"
import apiError from "../utils/api_error"
import crypto from "crypto";

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

    generateState() {
        return crypto.randomBytes(32).toString("hex")
    }

    async generateAuthUrl(state){
        const endpoints = await this.getEndPoints()
        const params =  new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'consent',
            state: state
        })

        return `${endpoints.auth}?${params}`
    }

    async tokenExchange(tempToken) {
    try {
        const endpoints = await this.getEndPoints();
        const payload =  {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: process.env.REDIRECT_URI,
            code: tempToken
        }

        const response = await axios.post(
            endpoints.token,  
            new URLSearchParams(payload),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        )

        return response.data
    } catch (error) {
            throw new apiError(502, "token exchange failed")
        }
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