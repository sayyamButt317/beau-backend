export interface AddProductBody {
  productName: string;
  slug?: string;
  brandName?: string;
  brandLogo?: string;
  productDescription?: string;
  Price?: string;
  discountedPrice?: string;
  Category?: string;
  amountInStock?: number;
  productImages?: string[];
  productVideo?: string;
  product360Image?: string;
  productGradeCode?: string;
  productPrice?: ProductPrice;
  productInventory?: ProductInventory;
  formulaandFinish?: FormulaandFinish;
  ProductStatus?: "active" | "inactive" | "draft" | "discontinued";
  collection?: (
    | "Everyday Glow"
    | "Night Out"
    | "Clean Skin"
    | "New Drop"
    | "Best Sellers"
  )[];
  category?:
    | "Face"
    | "Eyes"
    | "Lips"
    | "Cheeks"
    | "Brows"
    | "Body"
    | "Hair"
    | "Makeup"
    | "Nail"
    | "Skin"
    | "Sets"
    | "Other";
  featured?:
    | "New Arrival"
    | "Best Seller"
    | "Trending"
    | "Limited Edition"
    | "Recommended";
} 

export interface ProductPrice {
  regularPrice?: string;
  salePrice?: string;
  costprice?: string;
  currency?: "PKR";
  discountstartdate?: Date;
  discountenddate?: Date;
}



export interface ProductInventory {
  stockquantity: number;
  lowStockThreshold: number;
  barcode: string;
}

export interface FormulaandFinish{
  finish?: string;
  category?: string;
  undertone?: string;
  shadefamily?: string;
  formula?: string;
  skinType?: string;
  countryorigin?: string;
  shelfLife?: string;
}


export interface UpdateProductBody extends Partial<AddProductBody> {
  _id: string;
}

export interface DeleteProductBody {
  _id: string;
}
