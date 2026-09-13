import moongose from "mongoose";

const ProductSchema = new moongose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product Name is Required"],
    },
    brandName: {
      type: String,
    },
    brandLogo: {
      type: String,
    },
    productDescription: {
      type: String,
    },
    Price: {
      type: String,
    },
    discountedPrice: {
      type: String,
    },
    Category: {
      type: String,
    },
    amountInStock: {
      type: Number,
    },
    productImages: {
      type: [String],
    },
    productVideo: {
      type: String,
    },
    productGradeCode: {
      type: String,
    },
  },
  { timestamps: true }
);

const ProductModel = moongose.model("Product", ProductSchema);
export default ProductModel;
