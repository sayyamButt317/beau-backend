import express from "express";
import {
  getProductsController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../Controllers/productController.js";
import { loginController, registerController } from "../Controllers/userController.js";

const router = express.Router();

//Auth Routes
router.post("/register", registerController);
router.post("/login", loginController);

//Products Routes
router.get("/products", getProductsController);
router.post("/create", addProductController);
router.post("/edit", updateProductController);
router.post("/delete", deleteProductController);

export default router;
