import OauthService from "./oauth.service";
import apiError from "../utils/api_error";
import apiRes from "../utils/api_response";
import User from "../user/user.model";
import issuetoken from "../utils/jwt";

const oauthService =  new OauthService()

const redirectUser =  async (req, res, next) => {
    try {
        const state = oauthService.generateState()
        req.session.oauthState = state

        const url = await oauthService.generateAuthUrl(state)
        res.redirect(url)
    } catch (error) {
        next(error)
    }
}


const handlCallBck = async (req, res, next) => {
    try {
        const {state, code, error} = req.query

        if (error) return next(apiError.provideError("provider error"))
        if(state !== req.session.oauthState) return next(apiError.invalidState())
        delete req.session.oauthState
        if (!code) return next(apiError.authCodeMissing("the auth is is missing"))

        const tokenObj = await oauthService.tokenExchange(code)
        const userData = await oauthService.getUserData(tokenObj.access_token)

        const user = await User.findOrCreateUser(userData)
        user.refreshToken = tokenObj.refresh_token
        const token = await issuetoken(user._id)

        await user.save()
        const {  _id, name, email, picture } = user
        return new apiRes(res, 200, "login successfull", {user: { _id, name, email, picture}, token })
    } catch (error) {
        next(error)
    }
}

export { handlCallBck, redirectUser}