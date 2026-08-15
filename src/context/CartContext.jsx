import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContext.jsx';
import * as cartService from '../services/cartService.js';
import { loadGuestCart, saveGuestCart, clearGuestCart } from '../utils/guestCart.js';

const CartContext = createContext(null);
const CART_QUERY_KEY = ['cart'];

function guestItemFromProduct(product, quantity) {
  const productId = product.id ?? product._id;
  return {
    productId,
    quantity,
    product: {
      id: productId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? null,
      images: product.images ?? [],
      stockQuantity: product.stockQuantity,
      condition: product.condition,
      conditionGrade: product.conditionGrade ?? null,
      category: product.category,
    },
  };
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [guestItems, setGuestItems] = useState(loadGuestCart);
  const hasMergedRef = useRef(false);

  const serverCartQuery = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartService.getCart,
    enabled: isAuthenticated,
    select: (result) => result.data.cart,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      hasMergedRef.current = false;
      return;
    }
    if (hasMergedRef.current) return;
    hasMergedRef.current = true;

    if (guestItems.length === 0) return;

    cartService
      .mergeGuestCart(guestItems.map(({ productId, quantity }) => ({ productId, quantity })))
      .then(() => {
        clearGuestCart();
        setGuestItems([]);
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) saveGuestCart(guestItems);
  }, [guestItems, isAuthenticated]);

  const items = isAuthenticated
    ? (serverCartQuery.data?.items ?? [])
    : guestItems.map((item) => ({
        ...item,
        available: item.product.stockQuantity > 0,
        maxQuantity: item.product.stockQuantity,
      }));

  const savedItems = isAuthenticated ? (serverCartQuery.data?.savedItems ?? []) : [];

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = async (product, quantity = 1) => {
    const productId = product.id ?? product._id;

    if (isAuthenticated) {
      await cartService.addCartItem(productId, quantity);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      return;
    }

    setGuestItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, product.stockQuantity);
        return current.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQuantity } : item
        );
      }
      return [...current, guestItemFromProduct(product, Math.min(quantity, product.stockQuantity))];
    });
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      await cartService.updateCartItem(productId, quantity);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      return;
    }

    setGuestItems((current) =>
      quantity < 1
        ? current.filter((item) => item.productId !== productId)
        : current.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const removeItem = async (productId) => {
    if (isAuthenticated) {
      await cartService.removeCartItem(productId);
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      return;
    }
    setGuestItems((current) => current.filter((item) => item.productId !== productId));
  };

  const toggleSaveForLater = async (productId) => {
    if (!isAuthenticated) return;
    await cartService.toggleSaveForLater(productId);
    queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
  };

  const isInCart = (productId) => items.some((item) => item.productId === productId);

  const value = useMemo(
    () => ({
      items,
      savedItems,
      subtotal,
      itemCount,
      isLoading: isAuthenticated && serverCartQuery.isLoading,
      addItem,
      updateQuantity,
      removeItem,
      toggleSaveForLater,
      isInCart,
      canSaveForLater: isAuthenticated,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, savedItems, subtotal, itemCount, isAuthenticated, serverCartQuery.isLoading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
