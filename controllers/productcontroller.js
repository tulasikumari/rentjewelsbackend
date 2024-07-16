const Products = require("../model/productModel");
const cloudinary = require("cloudinary");

const createProduct = async (req, res) => {
  // step 1 : Check incomming data
  console.log(req.body);
  console.log(req.files);

  // step:2 destructuring
  const { productName, productPrice, productDescription, productCategory,productquantity } =
    req.body;

  const { productImage } = req.files;

  // step 3 : validate the data
  if (
    !productName ||
    !productPrice ||
    !productDescription ||
    !productCategory ||
    !productImage
  ) {
    return res.json({
      success: false,
      message: "Please fill all the fields.",
    });
  }

  // step 4 : try catch block
  try {
    // step 5 : upload image to cloudinary
    const uploadedImage = await cloudinary.v2.uploader.upload(
      productImage.path,
      {
        folder: "products",
        crop: "scale",
      }
    );

    // save the products
    const newProduct = new Products({
      productName: productName,
      productPrice: productPrice,
      productDescription: productDescription,
      productCategory: productCategory,
      productquantity:productquantity,
      productImageUrl: uploadedImage.secure_url,
    });
    await newProduct.save();
    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// function for getting all products
const getAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Products.find();
    res.json({
      success: true,
      message: "Products fetched successfully",
      products: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// get products by id
const getSingleProduct = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "Product ID is required!",
    });
  }
  try {
    const singleProducts = await Products.findById(id);
    res.json({
      success: true,
      message: "Product fetched successfully",
      product: singleProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

// get products by id
const getProductDetailsApi = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  console.log(req.body);

  try {
    if (!id) {
      return res.json({
        success: false,
        message: "Product ID is required!",
      });
    }

    const singleProducts = await Products.findById(id);

    if (!singleProducts) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("hello");
    res.json({
      success: true,
      message: "Product fetched successfully",
      product: singleProducts,
    });
  } catch (error) {
    console.log("fghj");
    console.error(error);
    res.status(500).json("Server Error");
  }
};

// update product
const updateProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  // destructuring
  const { productName, productPrice, productDescription, productCategory ,productquantity} =
    req.body;
  const { productImage } = req.files;

  // destructure id form URl
  const id = req.params.id;

  // validation
  if (
    !productName ||
    !productPrice ||
    !productDescription ||
    !productCategory ||
    !productquantity
  ) {
    res.json({
      success: false,
      message: "All fields are required!",
    });
  }
  try {
    if (productImage) {
      const uploadedImage = await cloudinary.v2.uploader.upload(
        productImage.path,
        {
          folder: "products",
          crop: "scale",
        }
      );

      // update the product
      const updatedProduct = {
        productName: productName,
        productPrice: productPrice,
        productDescription: productDescription,
        productCategory: productCategory,
        productquantity:productquantity,
        productImageUrl: uploadedImage.secure_url,
      };
      await Products.findByIdAndUpdate(id, updatedProduct);
      res.json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      // update the product
      const updatedProduct = {
        productName: productName,
        productPrice: productPrice,
        productDescription: productDescription,
        productquantity:productquantity,
        productCategory: productCategory,
      };
      await Products.findByIdAndUpdate(id, updatedProduct);
      res.json({
        success: true,
        message: "Product updated successfully without image",
        product: updatedProduct,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.json({
        success: false,
        message: "Product not found!",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    }
    );
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductDetailsApi,
};
