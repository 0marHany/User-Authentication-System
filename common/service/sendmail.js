const nodemailer = require("nodemailer");

async function sendMail(from, to, subject, text, html) {
    var transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: process.env.sender,
            pass: process.env.sender_password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return info
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}
module.exports = sendMail;