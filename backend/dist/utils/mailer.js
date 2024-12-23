"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../environment/env");
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
        user: env_1.Local.MAIL_USER,
        pass: env_1.Local.MAIL_PASS
    }
});
function sendOTP(email, OTP) {
    const mailOptions = {
        from: env_1.Local.MAIL_USER,
        to: email,
        subject: "Verify Account",
        html: `<b>Greetings,</b> <br/>  <p>Your OTP is: ${OTP}</p> <br/> <h5>${OTP}</h5><br/> <span><b>Kindly note:</b> Please be aware of phishing sites and always make sure you are visiting the official Eye-Refer website when entering sensitive data.</span> <br/><br/>
        <span style="margin-left: auto;">© 2024 Eye-Refer. All rights reserved<span>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log("Error: ", error);
        }
        console.log('Email sent: ' + info.response);
        return info.response;
    });
}
exports.default = sendOTP;
