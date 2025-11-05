import mongoose from "mongoose";


let userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required : true,
        unique : true
    },
    email: {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required : true,
    },
    avatar: {
        type: String,
        default:"https://th.bing.com/th/id/OIP.OWHqt6GY5jrr7ETvJr8ZXwHaHa?rs=1&pid=ImgDetMain",
    },
},
{
    timestamps: true
}
)

let User = mongoose.model("User", userSchema);

export default User