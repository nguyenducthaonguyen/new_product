'use client';

import type { Cart as CartType } from '@/entities/cart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

type OrderReviewProps = {
  cart: CartType;
  shippingCost: number;
};

export function OrderReview({ cart, shippingCost }: OrderReviewProps) {
  const subtotal = cart.total_price;
  const tax = 0; // Tax calculation can be added later
  const total = subtotal + shippingCost + tax;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Review</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map(item => (
            <div key={item.itemId} className="flex items-center gap-4">
              {item.image && (
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border">
                  <Image
                    src={item.image}
                    alt={item.name || item.sku}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {item.name && (
                  <p className="font-semibold truncate">{item.name}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  SKU:
                  {' '}
                  {item.sku}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity:
                  {' '}
                  {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  USD
                  {' '}
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>
              Subtotal (
              {cart.total_items}
              {' '}
              items)
            </span>
            <span className="font-semibold">
              USD
              {' '}
              {subtotal.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-semibold">
              USD
              {' '}
              {shippingCost.toFixed(2)}
            </span>
          </div>
          
          {tax > 0 && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-semibold">
                USD
                {' '}
                {tax.toFixed(2)}
              </span>
            </div>
          )}
          
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                USD
                {' '}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

