import { Schema, model } from "mongoose"
import { hash as _hash, compare } from "bcryptjs"


const userSchema = new Schema({
    email: {
        type: String,
        required: [ true, "Email is required for creating a user" ],
        trim: true,
        lowercase: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
        unique: [ true, "Email already exists." ]
    },
    name: {
        type: String,
        required: [ true, "Name is required for creating an account" ]
    },
    password: {
        type: String,
        required: [ true, "Password is required for creating an account" ],
        minlength: [ 6, "password should contain more than 6 character" ],
        select: false //password will not be sent in any query related to user data
    },
    //by default it is false , means only preson who has database access can make a systemUser for initial money fund
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return 
    }

    const hash = await _hash(this.password, 10)
    this.password = hash

    return 

})

userSchema.methods.comparePassword = async function (password) {

    

    return await compare(password, this.password)

}


const userModel = model("user", userSchema)

export default userModel