import express from "express";
import {
  getProductsController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../Controllers/productController.ts";
import { loginController, registerController } from "../Controllers/userController.ts";

const router = express.Router();

//Auth Routes
router.post("/register", registerController);
router.post("/login", loginController);

//Products Routes
router.get("/getrecord", getProductsController);
router.post("/create", addProductController);
router.post("/edit", updateProductController);
router.post("/delete", deleteProductController);

export default router;
