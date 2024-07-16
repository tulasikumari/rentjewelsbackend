// import * as otpService from '../services/otpServices.js';
const Users = require("../model/userModel");
const otpService= require("../services/otpservices");
 
 const sendOTP = async (req, res, next) => {
 
 
const email = req.body.email;
 
if (email == null || email == undefined || email == "") {
 
return respondWithError(res, 'BAD_REQUEST', "Email is required"); //milaune
}
 
const user = await Users.findOne({ email: email });
 
if (!user) {
    otpService.sendOTP(req.body, (error, results) => {
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.toString(),
            });
        }
        return res.status(200).send({
            success: true,
            message: 'OTP sent successfully',
            hash: results,
        });
    });
}
 else {
    return respondWithError(res, 'BAD_REQUEST', "Email already exists"); //yesli milaune
 }
}
 
 const verifyOTP = async (req, res, next) => {
                  
 
    if (!req.body.email || !req.body.otp) { //
        return respondWithError(res, 'BAD_REQUEST', "Invalid OTP"); //milaune
    }
 
    otpService.verifyOTP(req.body, (error, results) => {
        if (error) {
            return res.status(400).send({
                message: "Invalid OTP",
                data: error,
            });
        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
};
const forgetPassword = (eml) => {
    return new Promise((resolve, reject) => {
        const email = eml;
        otpService.forgotpass(email, (error, results) => {
            if (error) {
                console.log("Error occurred in forgetPassword function");
                reject(error);
            } else {
                console.log("OTP sent successfully: " + results);
                resolve(results);
            }
        });
    });
};
 
module.exports={forgetPassword, sendOTP,verifyOTP} ;