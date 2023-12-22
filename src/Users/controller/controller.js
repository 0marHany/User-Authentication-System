const { User } = require("../model/model")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const sendMail = require("../../../common/service/sendmail");

const GetHandler = async (req, res) => {
    const data = await User.find({})
    try {
        res.status(StatusCodes.OK).json({ message: "Succsess", data })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed", Error: error.message })
    }
}

const AddHandler = async (req, res) => {
    try {
        const { FirstName, LastName, Age, Address, Phone, Gender, Email, Password, RePassword } = req.body;
        const user = await User.findOne({ Email })
        if (user)
            res.status(StatusCodes.BAD_REQUEST).json({ Message: "Exist" })
        else {
            const data = new User({ FirstName, LastName, Age, Address, Phone, Gender, Email, Password, RePassword })

            await data.save();

            const token = jwt.sign({ _id: data._id }, process.env.sekretkey, { expiresIn: '1d' })

            const info = await sendMail("Authentication@gmail.com", Email, "Verifivation", "confirm",
                `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Email Confirmation</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100vh;
                    }
                
                    .container {
                      max-width: 600px;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 5px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      text-align: center;
                    }
                
                    h1 {
                      color: #333333;
                    }
                
                    p {
                      color: #555555;
                    }
                
                    .button {
                      display: inline-block;
                      padding: 10px 20px;
                      font-size: 16px;
                      text-decoration: none;
                      color: #ffffff;
                      background-color: #007bff;
                      border-radius: 5px;
                      cursor: pointer;
                    }
                
                    .button:hover {
                      background-color: #0056b3;
                    }
                
                    .confirmation-message {
                      display: none;
                      margin-top: 20px;
                      color: #28a745;
                      font-weight: bold;
                    }
                
                    a {
                      color: #ffffff;
                      text-decoration: none;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Email Confirmation</h1>
                    <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
                    <a href="http://localhost:${process.env.port}/user/verified/${token}"><button class="button">Yes, I'm Confirming</button></a>
                  </div>
                </body>
                </html>                
            `)
            console.log(info);
            if (info.messageId) {
                res.status(StatusCodes.CREATED).json({ message: "Succsess", token, data })
            }
            else
                res.status(StatusCodes.FORBIDDEN).json({ Message: info })
        }
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed", Error: error.message })
    }
}

const VerifiedHandler = async (req, res) => {
    const { token } = req.params;
    const decode = jwt.verify(token, process.env.sekretkey)
    const user = await User.findOne({ _id: decode._id })
    if (user) {
        await User.updateOne({ _id: user._id }, {
            verified: true
        })
        res.status(StatusCodes.OK).json({ verified: true })
    }
    else
        res.status(StatusCodes.FORBIDDEN).json({ verified: false })
}

const SignHandler = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (user) {
            const match = await bcrypt.compare(Password, user.Password);
            if (match) {
                const { Password, RePassword, ...data } = user._doc;
                const token = jwt.sign({ _id: data._id }, process.env.sekretkey, { expiresIn: '1d' })
                res.status(StatusCodes.ACCEPTED).json({ Message: "Successful", UserData: data, token })
            }
            else
                res.status(StatusCodes.UNAUTHORIZED).json({ Message: "WRONG PASSWORD" })
        }
        else
            res.status(StatusCodes.UNAUTHORIZED).json({ Message: "WRONG EMAIL" })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ ERROR: error.message })
    }
}

const PutHandler = async (req, res) => {
    const { id } = req.params;
    const { Password, RePassword } = req.body;
    try {
        const data = await User.updateOne({ _id: id }, { Password, RePassword });
        console.log(data.matchedCount);
        if (data.matchedCount)
            res.status(StatusCodes.ACCEPTED).json({ messsage: "Done", data });
        else
            res.status(StatusCodes.BAD_REQUEST).json({ messsage: "Failed", data });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed", Error: error.message })
    }

}

const DeleteHandler = async (req, res) => {
    const { id } = req.params;
    const data = await User.deleteMany({})
    try {
        res.status(StatusCodes.OK).json({ message: "Succsess", data })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Failed", Error: error.message })
    }

}

module.exports = { GetHandler, AddHandler, SignHandler, PutHandler, DeleteHandler, VerifiedHandler }