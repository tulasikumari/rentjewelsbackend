const Contact = require("../model/contactModel");
const Users = require("../model/userModel");

const createContact = async (req, res) => {
  // step 1 : Check if data is coming or not
  console.log(req.body);

  // step 2 : Destructure the data
  const { name, email, message } = req.body;

  // step 3 : validate the incomming data
  if (!name || !email || !message) {
    return res.json({
      success: false,
      message: "Please fill all the fields.",
    });
  }

  // step 4 : try catch block
  try {
    const createContact = new Contact({
      name: name,
      email: email,
      message: message,
    });

    // step 7 : save user and response
    await createContact.save();
    res.status(200).json({
      success: true,
      message: "Contact created successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const getAllContact = async (req, res) => {
  console.log("Get all contact");

  try {
    console.log("Before yry");
    const contact = await Contact.find();
    console.log("9");

    if (!contact) {
      console.log("No contact found");
      return res.json({
        success: false,
        message: "No contact found",
      });
    } else {
      return res.json({
        success: true,
        message: "Contact found",
        data: contact,
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
        message: "No contact found",
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
const deleteContactById = async (req, res) => {
  console.log("user id: " + req.params.id); // Use req.params.id consistently
  try {
    const deleteUser = await Contact.findByIdAndDelete(req.params.id);

    if (!deleteUser) {
      return res.json({
        success: false,
        message: "Meaage not found!",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
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
  createContact,
  getAllContact,
  getpagination,
  deleteContactById,
};
