// import crypto from "crypto";
// import otpGenerator from "otp-generator";
// import emailServices from "../services/emailerServices.js";

const crypt = require("crypto");
const otpGenerator = require("otp-generator");
// const emailerServices = require("../services/emailerServices.js");
const storage = require("node-persist");
const emailerServices = require("./emailservice");

//  await storage.init();
const initializeStorage = async () => {
  await storage.init();
};

// Call the initialization function
initializeStorage();

const key = "helloworld";
const sendOTP = async (params, callback) => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  console.log("Otp generated from backend " + otp);
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${params.email}.${otp}.${expires}`;
  const hash = crypt.createHmac("sha256", key).update(data).digest("hex");
  const fullhash = `${hash}.${expires}`;
  console.log(hash);
  console.log(fullhash);
  await storage.setItem("user_hash", fullhash);

  const otpMessage = `Dear user, ${otp} is the one time password for signup`;

  const model = {
    email: params.email,
    subject: "HomeDecore Registration OTP",
    body: otpMessage,
  };

  emailServices.sendEmail(model, (error, result) => {
    if (error) {
      return callback(error);
    }
    return callback(null, fullhash);
  });
};

const verifyOTP = async (params, callback) => { 

  if (!params.email || !params.otp) {
    return callback("Invalid OTP");
  }

  const hash = await storage.getItem("user_hash");

  const [hashValue, expires] = hash.split(".");
  const now = Date.now();
  console.log(params.email);
  console.log(params.otp);
  console.log(params.hash);
  console.log(hashValue);

  if (now > parseInt(expires)) {
    console.log("Otp Expired");
    return callback("OTP Expired");
  }

  const data = `${params.email}.${params.otp}.${expires}`;
  console.log(params.email, params.otp);
  const newCalculatedHash = crypt
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  console.log(newCalculatedHash);
  console.log(hashValue);

  if (newCalculatedHash === hashValue) {
    console.log("Otp Matched, Success");
    return callback(null, "Success");
  }
  return callback("Invalid OTP");
};

const forgotpass = async (emails, callback) => {
  const otp = otpGenerator.generate(4, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${emails}.${otp}.${expires}`; //
  const hash = crypt.createHmac("sha256", key).update(data).digest("hex");
  const fullhash = `${hash}.${expires}`;
  await storage.setItem("user_hash", fullhash);

  const otpMessage = `Dear user, ${otp} is the one time password your password reset.`;

  const model = {
    email: emails,
    subject: "HomeDecore Password Reset",
    body: otpMessage,
  };

  console.log("Otp generated from backend " + otp);
  console.log(otpMessage);

  emailerServices.sendEmail(model, (error, result) => {
    if (error) {
      return callback(error);
    } else {
      console.log(callback);
      return callback(null, fullhash);
    }
  });
};

module.exports = { forgotpass, verifyOTP, sendOTP };
