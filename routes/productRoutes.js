const router = require("express").Router();
const productController = require("../controllers/productcontroller");
const { authGuardAdmin } = require("../middleware/authGuard");

// Create product API
router.post("/create_product", authGuardAdmin, productController.createProduct);

// Get all products API
router.get("/get_products", productController.getAllProducts);

// Get single product API | /get_product/:id
router.get("/get_product/:id", productController.getSingleProduct);

router.get("/getProductDetailsApi/:id", productController.getProductDetailsApi);


// router.post("/create_order",orderController.createOrder)
 
// router.get("/get_order/:id",orderController.getOrders)

// update product API
router.put(
  "/update_product/:id",
  authGuardAdmin,
  productController.updateProduct
);

// delete product API
router.delete(
  "/delete_product/:id",
  authGuardAdmin,
  productController.deleteProduct
);

module.exports = router;
