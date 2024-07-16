
const router = require("express").Router();
// const productController = require("../controllers/productcontroller");
const { authGuardAdmin } = require("../middleware/authGuard");

const shippingInfoController= require("../controllers/shippingInfoController")
//shipping info
router.post('/createShippingInfo', shippingInfoController.createShippingInfo)
router.get('/getShippingInfoByUserID/:id', shippingInfoController.getShippingInfoByUserID)
router.get('/getSingleShippingInfo/:id', shippingInfoController.getSingleShippingInfo)
router.put('/updateShippingInfo/:id', shippingInfoController.updateShippingInfo)
 
module.exports = router;



