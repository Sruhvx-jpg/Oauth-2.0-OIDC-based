import OauthService from "./oauth.service";
import apiError from "../utils/api_error";
import apiRes from "../utils/api_response";


const oauthService =  new OauthService()

const redirectUser =  async (req, res, next) => {
    try {
        const url = await oauthService.generateAuthUrl()
        res.redirect(url)
    } catch (error) {
        next(error)
    }
}


const handlCallBck = async (req, res, next) => {
    try {
        const {code, query} = req.query

        if (error) return next(apiError.provideError("provider error"))
        if (!code) return next(apiError.authCodeMissing("the auth is is missing"))

        const token = await oauthService.tokenExchange(code)
        const user = await oauthService.getUserData(token.access_token)

        return new apiRes(res, 200, "login successfull", {user })
    } catch (error) {
        next(error)
    }
}