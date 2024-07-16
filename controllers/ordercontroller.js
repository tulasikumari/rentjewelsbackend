const Orders = require("../model/orderModel");

const createOrder = async (req, res) => {
  console.log(req.body);

  const {
    userID,
    shoppingItemList,
    totalPayment,
    paymentMethod,
    orderStatus,
    createdAt,
  } = req.body;

  if (
    !userID ||
    !shoppingItemList ||
    !totalPayment ||
    !paymentMethod ||
    !orderStatus ||
    !createdAt
  ) {
    return res.json({
      success: false,
      message: "Please fill all the fields",
    });
  }

  let parsedShoppingItemList;
  try {
    parsedShoppingItemList = JSON.parse(shoppingItemList);
    if (!Array.isArray(parsedShoppingItemList)) {
      throw new Error("Invalid shoppingItemList format");
    }
  } catch (error) {
    console.error("Error parsing shoppingItemList:", error);
    return res.status(400).json({
      success: false,
      message: "Invalid shoppingItemList format",
    });
  }

  try {
    const newOrder = new Orders({
      userID,
      shoppingItemList: parsedShoppingItemList,
      totalPayment,
      paymentMethod,
      orderStatus: orderStatus || "pending",
      createdAt: createdAt || Date.now(),
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message:
        "Your order has been created. Check the status of your order in the order section",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getSingleOrder = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.json({
      success: false,
      message: "Order id is required!",
    });
  }
  try {
    const singleOrder = await Orders.findById(id).populate({
      path: "shoppingItemList.shoppingBagID",
      model: "ShoppingBag",
      populate: {
        path: "productID",
        model: "Product",
        select:
          "productName productPrice productCategory productDescription productImageURL",
      },
    });
    res.json({
      success: true,
      message: "Order fetched successfully",
      order: singleOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};

const getOrderByUserID = async (req, res) => {
  const id = req.params.id;
  try {
    const orders = await Orders.find({ userID: id }).populate({
      path: "shoppingItemList.shoppingBagID",
      model: "ShoppingBag",
      populate: {
        path: "productID",
        model: "Product",
        select:
          "productName productPrice productCategory productDescription productImageURL",
      },
    });

    res.json({
      message: "Orders retrieved",
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving orders",
      success: false,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate({
        path: "shoppingItemList.shoppingBagID",
        model: "ShoppingBag",
        populate: {
          path: "productID",
          model: "Product",
          select:
            "productName productPrice productCategory productDescription productImageURL",
        },
      })
      .populate("shippingID", "firstName lastName address contactNumber");

    res.json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  console.log(req.body); // Debugging: Log the request body

  const { orderStatus } = req.body;
  const id = req.params.id;

  const validStatuses = ["PENDING", "IN PROCESS", "DELIVERED", "CANCELED"];

  if (!orderStatus) {
    return res.json({
      success: false,
      message: "orderStatus is required!",
    });
  }

  if (!validStatuses.includes(orderStatus)) {
    return res.json({
      success: false,
      message: `Invalid orderStatus. Valid statuses are: ${validStatuses.join(
        ", "
      )}.`,
    });
  }

  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      { orderStatus: orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const cancelOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const canceledOrder = await Orders.findByIdAndDelete(id);
    if (!canceledOrder) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order canceled successfully",
      data: canceledOrder,
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
  createOrder,
  getSingleOrder,
  getOrderByUserID,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
