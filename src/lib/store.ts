import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

type Store = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, variantLabel: string, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      addToCart: (product, variantLabel, quantity = 1) =>
        set((state) => {
          const variant = product.variants.find((item) => item.label === variantLabel) ?? product.variants[0];
          const key = `${product.id}-${variant.label}`;
          const existing = state.cart.find((item) => item.key === key);
          if (existing) {
            return { cart: state.cart.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item) };
          }
          return {
            cart: [...state.cart, {
              key,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              variant: variant.label,
              unitPrice: variant.price,
              quantity
            }]
          };
        }),
      updateQuantity: (key, quantity) => set((state) => ({
        cart: quantity < 1 ? state.cart.filter((item) => item.key !== key) : state.cart.map((item) => item.key === key ? { ...item, quantity } : item)
      })),
      removeFromCart: (key) => set((state) => ({ cart: state.cart.filter((item) => item.key !== key) })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId) ? state.wishlist.filter((id) => id !== productId) : [...state.wishlist, productId]
      }))
    }),
    { name: "gee-hair-store" }
  )
);
