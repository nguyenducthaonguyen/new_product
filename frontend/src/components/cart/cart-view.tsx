'use client';

import type { Cart } from '@/entities/cart';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getCart, removeCartItem, updateCartItem } from '@/actions/cart-action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCartStore } from '@/stores/cart-store';

type CartViewProps = {
  initialCart: Cart | null;
};

export function CartView({ initialCart }: CartViewProps) {
  const { cart, setCart } = useCartStore();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const currentCart = cart || initialCart;

  useEffect(() => {
    if (initialCart) {
      setCart(initialCart);
    } else {
      // Fetch cart if not provided
      getCart().then((result) => {
        if (result.success && result.data) {
          setCart(result.data);
        }
      });
    }
  }, [initialCart, setCart]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return;
    }

    setIsUpdating(itemId);
    try {
      const result = await updateCartItem(itemId, { quantity: newQuantity });

      if (result.success && result.data) {
        setCart(result.data);
        toast.success('Cart updated');
      } else {
        toast.error(result.error || 'Failed to update cart');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsUpdating(itemId);
    try {
      const result = await removeCartItem(itemId);

      if (result.success && result.data) {
        setCart(result.data);
        toast.success('Item removed from cart');
      } else {
        toast.error(result.error || 'Failed to remove item');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(null);
    }
  };

  if (!currentCart) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (currentCart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {currentCart.items.map(item => (
            <Card key={item.itemId}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Product Image */}
                  {item.image && (
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border">
                      <Image
                        src={item.image}
                        alt={item.name || item.sku}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    {/* Product Name */}
                    {item.name && (
                      <h3 className="font-semibold mb-1 truncate">
                        {item.name}
                      </h3>
                    )}
                    {/* SKU */}
                    <p className="text-sm text-muted-foreground mb-1">
                      SKU:
                      {' '}
                      {item.sku}
                    </p>
                    {/* Price per item */}
                    <p className="text-sm text-muted-foreground">
                      USD
                      {' '}
                      {item.price.toFixed(2)}
                      {' '}
                      each
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                        disabled={isUpdating === item.itemId || item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                        disabled={isUpdating === item.itemId}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="font-semibold">
                        USD
                        {' '}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.itemId)}
                      disabled={isUpdating === item.itemId}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  Subtotal (
                  {currentCart.total_items}
                  {' '}
                  items)
                </span>
                <span className="font-semibold">
                  USD
                  {' '}
                  {currentCart.total_price.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    USD
                    {currentCart.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
