export type ProductCategory = "Bone Straight" | "Curls" | "Wigs" | "Bundles";

export type ProductVariant = {
  label: string;
  price: number;
  stock: number;
};

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
  basePrice: number;
  variants: ProductVariant[];
  featured: boolean;
  badge?: string;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  variant: string;
  unitPrice: number;
  quantity: number;
};

export type OrderStatus = "Received" | "Confirmed" | "Preparing" | "Dispatched" | "Delivered" | "Cancelled";

export type Order = {
  reference: string;
  email: string;
  phone: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: CartItem[];
};
