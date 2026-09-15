import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: {
    id: string;
    name: string;
    priceInCents: number;
    currency: string;
    coverImageUrl: string | null;
    creatorName: string;
    slug: string;
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem["product"]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  get cartTotal(): number;
  get itemCount(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },
      clearCart: () => set({ items: [] }),
      get cartTotal() {
        return get().items.reduce(
          (total, item) => total + item.product.priceInCents * item.quantity,
          0
        );
      },
      get itemCount() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
