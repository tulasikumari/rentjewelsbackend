const Users = require("../model/userModel");

const getAllUsers = async (req, res) => {
  console.log("Get all user data requste");

  try {
    console.log("Before yry");
    const users = await Users.find();
    console.log("9");

    if (!users) {
      console.log("No users found");
      return res.json({
        success: false,
        message: "No user found",
      });
    } else {
      return res.json({
        success: true,
        message: "user found",
        data: users,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Eroor ocurred",
    });
  }
};

// Pagnation
const getpagination = async (req, res) => {
  // step:1 == get pageNo form froentend
  const requestPage = req.query.page;
  // step 2: Restult for per page
  // skiping = not showing same value in diff pages
  // no skiping

  const resultPerPage = 2;

  try {
    const user = await await Users.find({})
      .skip((requestPage - 1) * resultPerPage)
      .limit(resultPerPage);

    // if their os no user
    if (user.length === 0) {
      return res.json({
        success: false,
        message: "No products found",
      });
    }
    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "server Error",
    });
  }
};

const deleteUserById = async (req, res) => {
  console.log("uwe" + req.params.id);
  try {
    const deleteUser = await Users.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }

    res.json({
      success: true,
      message: "Users deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update user route handler
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the user ID is in the request parameters

    // Extract user information from the request body
    const { username, email, password } = req.body;

    // Update the user without profile image
    const updatedUserWithoutImage = {
      username,
      email,
      password, // Note: In production, you should handle passwords securely, maybe use a hashing library
    };

    await Users.findByIdAndUpdate(id, updatedUserWithoutImage);

    res.json({
      success: true,
      message: "User updated successfully without image",
      user: updatedUserWithoutImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getAllUsers,
  getpagination,
  deleteUserById,
  updateUser,
};
