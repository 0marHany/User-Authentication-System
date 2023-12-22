const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Age: { type: Number, required: true },
    Address: { type: String, required: true },
    Phone: { type: Number, required: true },
    Gender: { type: String, enum: ["male", "female"], required: true, },
    Email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: true
    },
    Password: { type: String, required: true },
    RePassword: { type: String, required: true },
    verified: { type: Boolean, default: false }
}, {
    timestamps: true
})
UserSchema.pre("save", async function (next) {
    this.Password = await bcrypt.hash(this.Password, 8)
    this.RePassword = this.Password;
    next();
});

module.exports = UserSchema;