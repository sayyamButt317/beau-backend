import type { Request, Response } from "express";
import ProductModel from "../Model/Product.js";
import type {
  AddProductBody,
  DeleteProductBody,
  UpdateProductBody,
} from "../Schema/Product_schema.js";
import { uploadImage, uploadVideo } from "./ImageController.js";
import { getErrorMessage } from "../Utils/error.js";

const getProductsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductModel.find().sort({ Price: 1 }).exec();
    res.status(200).json({ status: 200, data: products });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

const uploadProductImages = async (
  images: string[]
): Promise<string[]> => {
  const uploaded = await Promise.all(
    images.map((image) =>
      uploadImage(image, { folder: "products/images" })
    )
  );
  return uploaded.map((result) => result.secure_url);
};

const addProductController = async (
  req: Request<unknown, unknown, AddProductBody>,
  res: Response
): Promise<void> => {
  try {
    const { productImages, productVideo, ...productData } = req.body;

    let uploadedImageUrls: string[] = [];
    if (productImages?.length) {
      uploadedImageUrls = await uploadProductImages(productImages);
    }

    let productVideoUrl: string | undefined;
    if (productVideo) {
      const uploadedVideo = await uploadVideo(productVideo, {
        folder: "products/videos",
      });
      productVideoUrl = uploadedVideo.secure_url;
    }

    const newProduct = new ProductModel({
      ...productData,
      ...(uploadedImageUrls.length
        ? { productImages: uploadedImageUrls }
        : {}),
      ...(productVideoUrl ? { productVideo: productVideoUrl } : {}),
    });
    await newProduct.save();

    res.status(201).json({
      status: 201,
      message: "Product added Successfully",
      data: newProduct,
    });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

const updateProductController = async (
  req: Request<unknown, unknown, UpdateProductBody>,
  res: Response
): Promise<void> => {
  try {
    const { _id, productImages, productVideo, ...rest } = req.body;
    const updateData: Record<string, unknown> = { ...rest };

    if (productImages?.length) {
      updateData.productImages = await uploadProductImages(productImages);
    }

    if (productVideo) {
      const uploadedVideo = await uploadVideo(productVideo, {
        folder: "products/videos",
      });
      updateData.productVideo = uploadedVideo.secure_url;
    }

    const product = await ProductModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!product) {
      res.status(404).json({ status: 404, message: "Product not found" });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "data updated successfully",
      data: product,
    });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

const deleteProductController = async (
  req: Request<unknown, unknown, DeleteProductBody>,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.body._id);

    if (!product) {
      res.status(404).json({ status: 404, message: "Product not found" });
      return;
    }

    res
      .status(200)
      .json({ status: 200, message: "data deleted successfully" });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

const getProductByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      res.status(404).json({ status: 404, message: "Product not found" });
      return;
    }

    res.status(200).json({ status: 200, data: product });
  } catch (err: unknown) {
    res.status(500).json({ message: getErrorMessage(err) });
  }
};

export {
  getProductsController,
  getProductByIdController,
  addProductController,
  updateProductController,
  deleteProductController,
};
