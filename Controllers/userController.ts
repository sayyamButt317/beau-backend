import type { Request, Response } from "express";
import UserModel from "../Model/User.ts";
import type { LoginBody, RegisterBody } from "../Schema/Auth_schema.ts";
import { getErrorMessage } from "../Utils/error.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerController = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      res.status(400).json({
        message: "User with this email already exists",
      });
      return;
    }

    await UserModel.create({ name, email, password });
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
};

const loginController = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "Invalid password",
      });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string);
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: getErrorMessage(error),
    });
  }
  
};

export { registerController, loginController };
