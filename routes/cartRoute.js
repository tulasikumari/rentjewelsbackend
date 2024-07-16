const router = require("express").Router();
const orderController = require("../controllers/orderController");
const { authGuard, authGuardAdmin } = require("../middleware/authGuard");
const cartcontroller = require("../controllers/cartcontroller");

router.post("/addToCart", authGuard, cartcontroller.addToCart);
router.get("/getCartByUserID", cartcontroller.getCartByUserID);
router.get("/getSingleCart/:id", cartcontroller.getSingleCart);
router.put("/updateCart/:id", authGuard, cartcontroller.updateCart);
router.delete("/removeFromCart/:id", authGuard, cartcontroller.removeFromCart);

module.exports = router;
