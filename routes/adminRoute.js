const route=require ('express').Router();
const adminController=require("../controllers/admincontroller");
// const { authGuardAdmin } = require('../middleware/authGuard');

route.get('/getAllUser', adminController.getAllUsers)

route.get("/get_pagination", adminController.getpagination)

route.delete("/deleteUser/:id", adminController.deleteUserById)

route.put("/updateUser/:id", adminController.updateUser)



module.exports=route;
