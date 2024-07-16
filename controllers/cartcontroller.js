const cloudinary = require("cloudinary");
const Cart = require("../model/CartModel"); // Ensure the correct case
const Products = require("../model/productModel");
// const Products = require("../model/productModel");

const addToCart = async (req, res) => {
  console.log(req.body);

  const { userID, productid, totalPrice, quantity } = req.body;
  console.log(req.body + "my objrct");

  if (!userID || !productid || !totalPrice || !quantity) {
    return res.json({
      success: false,

      message: "Please provide all the details",
    });
  }

  try {
    const existingInCart = await Cart.findOne({
      userID: userID,
      productid: productid,
    });
    console.log("tes");

    if (existingInCart) {
      return res.json({
        success: false,
        message: "This item is already in shopping Bag",
      });
    }

    const product = await Products.findById(productid);
    console.log(product);
    const totalPrice = product.productPrice * quantity;

    console.log(userID);

    const newCart = new Cart({
      userID: userID,
      productid: productid,
      totalPrice: totalPrice,
      quantity: quantity,
    });

    await newCart.save();

    res.status(200).json({
      success: true,
      message: "Item added to Cart",
      data: newCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const getCartByUserID = async (req, res) => {
  const id = req.query.userID;
  console.log(`userid is ${id}`);

  try {
    const cart = await Cart.find({ userID: id }).populate(
      "productid",
      "itemName itemPrice itemSecurityDeposit size material colour weight itemImage owner contact categoryName"
    );
    res.json({
      message: "retrieved",
      success: true,
      cart: cart,
    });
  } catch (e) {
    res.json({
      message: "error",
      success: false,
    });
  }
};

const getSingleCart = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.json({
      success: false,
      message: "Cart id is required!",
    });
  }
  try {
    const singleCart = await Cart.findById(id);
    res.json({
      success: true,
      message: "Cart fetched successfully",
      cart: singleCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const updateCart = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  const { userID, productid, totalPrice, quantity } = req.body;

  const id = req.params.id;
  if (!userID || !productid || !totalPrice || !quantity) {
    return res.json({
      success: false,
      message: "All fields are required!",
    });
  }
  try {
    const updatedCart = {
      userID: userID,
      productid: productid,

      totalPrice: totalPrice,
      quantity: quantity,
    };
    await Cart.findByIdAndUpdate(id, updatedCart);
    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const removeFromCart = async (req, res) => {
  const id = req.params.id;
  try {
    const removedFromCart = await Cart.findByIdAndDelete(id);
    if (!removedFromCart) {
      return res.json({
        success: false,
        message: "Item not found in Cart",
      });
    }

    res.json({
      success: true,
      message: "Item removed from Cart successfully",
      data: removedFromCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addToCart,
  getCartByUserID,
  getSingleCart,
  updateCart,
  removeFromCart,
};
