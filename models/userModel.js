const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 25,
        },
        username: {
            type: String,
            required: true,
            trim: true,
            maxlength: 25,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        avatar: {
            type: String,
            default:
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
        },
        role: {
            type: String,
            default: "user",
        },
        gender: {
            type: String,
            default: "other",
        },
        saved: [
            {
                type: mongoose.Types.ObjectId,
                ref: "post",
            },
        ],
        story: {
            type: String,
            default: "",
            maxlength: 200,
        },
        status: {
            type: Boolean,
            default: true
        },
        website: {
            type: String,
            default: "",
        },
        followers: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],
        following: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],
        friends: [
            {
                type: mongoose.Types.ObjectId,
                ref: "user",
            },
        ],
        confirmMail: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("user", userSchema);
