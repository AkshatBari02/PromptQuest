import {Schema, model, models} from 'mongoose';

const userSchema = new Schema({
    email:{
        type: String,
        unique: [true,'Email already exists !'],
        required:[true,'Email is required !']
    },
    username:{
        type: String,
        required: [true, 'User is required !'],
        match: [/^(?=.{5,50}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,'Username Invalid, it should contain 5-50 alphanumeric letters and must be unique !']
    },
    image:{
        type: String
    }
});

const User = models.User || model("User", userSchema);
export default User