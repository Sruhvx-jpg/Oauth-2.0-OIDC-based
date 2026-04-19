import OauthService from "./oauth.service";
import apiError from "../utils/api_error";
import apiRes from "../utils/api_response";
import User from "../user/user.model";
import issuetoken from "../utils/jwt";

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
        const {code, error} = req.query

        if (error) return next(apiError.provideError("provider error"))
        if (!code) return next(apiError.authCodeMissing("the auth is is missing"))

        const tokenObj = await oauthService.tokenExchange(code)
        const userData = await oauthService.getUserData(tokenObj.access_token)

        const user = await User.findOrCreateUser(userData)
        const token = await issuetoken(user._id)

        return new apiRes(res, 200, "login successfull", {user, token })
    } catch (error) {
        next(error)
    }
}

export { handlCallBck, redirectUser}