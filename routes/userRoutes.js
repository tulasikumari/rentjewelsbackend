// import
const router = require("express").Router();
const userController = require("../controllers/userControllers");
const otpcontroller=require ("../controllers/otpcontroller")
const Users = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// create user api
router.post("/create", userController.createUser);

//  task 1: create login api
router.post("/login", userController.loginUser);

router.post("/changePassword", userController.changePassword);



router.post("/updateuser", userController.updateUserData);

router.post("/verifyOTP", otpcontroller.verifyOTP);

router.post("/forgetPassword", userController.forget);




// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt'); // Add this line
// const Users = require('../models/User'); // Assuming this is your User model

// ... other code ...
// Forget password API
// router.post("/forget_password", async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ msg: "Please enter all fields" });
//   }

//   try {
//     const user = await Users.findOne({ email });


//     if (!user) {
//       return res.status(400).json({ msg: "User does not exist" });
//     }
     
//       var transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "shasalini65@gmail.com",
//           pass: "asdfghjkl",
//         },
//       });
    
//       var mailOption = {
//         from: "HomeDecoe@gmail.com",
//         to: email,
//         subject: "password reset link",
//         text: link,
//       };
    
//       transporter.sendMail(mailOption, function (error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log("Email sent:" + info.response);
//         }
//       });
    

//     // const secret = process.env.JWT_SECRET + user.password;
//     // const token = jwt.sign({ email: user.email, id: user._id }, secret, {
//     //   expiresIn: "15m",
//     // });

//     // const link = `http://localhost:5000/api/user/reset-password/${user._id}/${token}`;
//     // console.log(link);

//     // Add logic to send the link to the user (e.g., via email)

//     // Redirect the user or send a response indicating the link has been sent
//     res.json({ msg: "Password reset link sent successfully"});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server Error" });
//   }

// });

// // Handle GET request for the reset password link
// router.get("/reset-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;

//   const oldUser = await Users.findOne({ _id: id });
//   if (!oldUser) {
//     return res.status(400).json({
//       msg: "User doesnot exist",
//     });
//   }
//   const secret = process.env.JWT_SECRET + oldUser.password;
//   try {
//     const verify = jwt.verify(token, secret);
//     if (verify) {
//       res.render("index", { email: verify.email });
//     }
//   } catch (error) {
//     res.status(500).json("Password reset link not verified");
//   }
// });

// router.post("/reset-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;
//   const { password } = req.body;

//   const oldUser = await Users.findOne({ _id: id });

//   if (!oldUser) {
//     return res.status(400).json({ mgs: "user doesnot exist" });
//   }
//   const secret = process.env.JWT_SECRET + oldUser.password;
//   try {
//     jwt.verify(token, secret);
//     const encryptedPassword = await bcrypt.hash(password, 10);
//     await Users.updateOne(
//       { _id: id },
//       { $set: { password: encryptedPassword } }
//     );
//     return res.status(200).json({ msg: "password Update successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "password reset failed" });
//   }
// });





(module.exports = router);
