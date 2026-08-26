import moongose from "mongoose";

const ProductSchema = new moongose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name is Required"],
    },
    brandName: {
      type: String,
      required: [true, "Brand Name is Required"],
    },
    brandLogo: {
      type: String,
      required: [true, "Brand Logo is Required"],
    },
    productDescription: {
      type: String,
      required: [true, "Product Description is Required"],
    },
    Price: {
      type: String,
      required: [true, "Price is Required"],
    },
    discountedPrice: {
      type: String,
    },
    Category: {
      type: String,
      required: true,
    },
    amountInStock: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: [true, "Product Image is Required"],
    },
    productVideo: {
      type: String,
    },
    productGradeCode: {
      type: String,
      required: [true, "Product Grade Code is Required"],
    },
  },
  { timestamps: true }
);

const ProductModel = moongose.model("Product", ProductSchema);
export default ProductModel;
