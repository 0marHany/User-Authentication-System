const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../../src/Users/model/model");

module.exports = () => {
    return async (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decode = jwt.verify(token, process.env.sekretkey)
            console.log(decode);
            const user = await User.find({ _id: decode._id })
            if (user)
                next()
            else
                res.status(StatusCodes.UNAUTHORIZED).json({ Error: "UNAUTHORIZED" })
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ Error: error.message })
        }
    }
}