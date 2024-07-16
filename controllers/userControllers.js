const Users = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const forgetPassword= require("../controllers/otpcontroller");
// const forgetPassword=require("../controllers/otpcontroller");
// Your other imports

const { forgetPassword } = require("../controllers/otpcontroller");

//const { forgetPass } = require("../controllers/otpcontroller");

// const {
//   forgetPass: forgetPasswordService,
// } = require("../controllers/otpcontroller");

// Your code using forgetPass

const createUser = async (req, res) => {
  // step 1 : Check if data is coming or not
  console.log(req.body);

  // step 2 : Destructure the data
  const { firstName, lastName, email, password } = req.body;

  // step 3 : validate the incomming data
  if (!firstName || !lastName || !email || !password) {
    return res.json({
      success: false,
      message: "Please fill all the fields.",
    });
  }

  // step 4 : try catch block
  try {
    // step 5 : Check existing user
    const existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists.",
      });
    }

    // password encryption
    const randomSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, randomSalt);

    // step 6 : create new user
    const newUser = new Users({
      // fieldname : incomming data name
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: encryptedPassword,
    });

    // step 7 : save user and response
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const loginUser = async (req, res) => {
  // Step 1 : Check if data is coming or not
  console.log(req.body);

  // step 2 : Destructure the data
  const { email, password } = req.body;

  // step 3 : validate the incomming data
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please fill all the fields.",
    });
  }

  // step 4 : try catch block
  try {
    // step 5 : Find user
    // const users = await User.find();
    const user = await Users.findOne({ email: email }); // user store all the data of user
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exists.",
      });
    }
    // Step 6 : Check password
    const passwordToCompare = user.password;
    const isMatch = await bcrypt.compare(password, passwordToCompare);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Password does not match.",
      });
    }

    // Step 7 : Create token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_TOKEN_SECRET
    );

    // Step 8 : Send Response
    res.status(200).json({
      success: true,
      token: token,
      userData: user,
      message: "User login in successfully.",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "server Error",
    });
  }
};
const changePassword = async (req, res) => {
  try {
    console.log(req.body);
    const { email, changepassword } = req.body;

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(changepassword, randomSalt);

    user.password = newHashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateUserData = async (req, res) => {
  console.log(req.body);

  const oldEmail = req.body.oldEmail;
  const newEmail = req.body.newEmail;
  const newPassword = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const isAdmin = req.body.isAdmin;

  if (!oldEmail) {
    return res.status(500).json({
      success: false,
      message: "Old email missing",
    });
  }

  try {
    const user = await Users.findOne({ email: oldEmail });

    if (!user) {
      console.log("User not found");
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    user.email = newEmail || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    if (newEmail && newEmail !== oldEmail) {
      console.log("here");
      const existingUser = await Users.findOne({ email: newEmail });
      if (existingUser && !existingUser._id.equals(user._id)) {
        console.log("Email already exists");
        return res.json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    if (isAdmin) {
      user.isAdmin = isAdmin; // Fix typo: Use user.isAdmin instead of Users.isAdmin
    }
    await user.save();
    console.log("User data updated successfully");

    const userData = await Users.findOne({ email: user.email });

    console.log(userData);

    return res.json({
      success: true,
      message: "User data updated successfully",
      userData: userData,
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating user data",
    });
  }
};

const forget = async (req, res) => {
  const email = req.body.email;
  console.log("Received email: " + email);

  try {
    const user = await Users.findOne({ email });
    if (user) {
      console.log("Existing user found: " + email);
      console.log(email);
      await forgetPassword(email); //

      // return respondWithData(res, 'SUCCESS', "OTP Sent successfully", hash);
      return res.status(500).json({
        success: true,
        message: "OTP Sent successfully",
      });
    } else {
      console.log("Existing user not found");
      // return respondWithError(res, 'NOT_FOUND', "Email Not found");
      res.status(404).json({ success: false, message: "Email Not found" });
      console.log("Existing user not found");
    }
  } catch (err) {
    console.error(err);
    // return respondWithError(res, 'INTERNAL_SERVER_ERROR', err.toString());
    res.status(500).json(err);
  }
};

module.exports = {
  createUser,
  loginUser,
  changePassword,
  updateUserData,
  forget,
};
