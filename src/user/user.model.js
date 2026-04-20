import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    picture: { type: String },
    provider: { type: String, default: "google" },
    providerId: { type: String },    // 'sub' from OIDC userinfo
    refreshToken: { type: String }, 
})

userSchema.statics.findOrCreateUser = async function(userData) {
    const {sub ,email , name, picture} = userData

    let user = await this.findOne({providerId: sub ,email})

    if(!user) {
        user =  await this.create({providerId: sub ,email , name, picture})
    }

    return user
}

export default mongoose.model("User", userSchema)