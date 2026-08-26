export interface AddProductBody {
  productName: string;
  brandName: string;
  brandLogo: string;
  productDescription: string;
  Price: string;
  discountedPrice?: string;
  Category: string;
  amountInStock: number;
  productImage: string;
  productVideo?: string;
  productGradeCode: string;
}

export interface UpdateProductBody extends Partial<AddProductBody> {
  _id: string;
}

export interface DeleteProductBody {
  _id: string;
}
