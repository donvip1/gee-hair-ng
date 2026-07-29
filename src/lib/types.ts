export type ProductCategory = "Straight" | "Curls" | "Waves";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  texture: string;
  description: string;
  details: string[];
  image: string;
  images: string[];
  minLength: number;
  maxLength: number;
  lengthStep: number;
  colours: string;
  bundleWeightGrams: number;
  featured: boolean;
  active: boolean;
  imagePending?: boolean;
  updatedAt?: string;
};

export type ProductInput = Omit<Product, "id" | "updatedAt"> & {
  id?: string;
};

export type CatalogResponse = {
  products: Product[];
  source: "live" | "fallback";
};

export type CatalogHealth = {
  ready: boolean;
  service: string;
  sheetName: string;
  driveFolderName: string;
  productCount: number;
};
