'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Cart as CartType } from '@/entities/cart';
import type { CreateOrderRequest } from '@/entities/order';
import { CreateOrderRequestSchema } from '@/entities/order';
import { createOrder } from '@/actions/order-action';
import { useCartStore } from '@/stores/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ShippingForm } from './shipping-form';
import { ShippingMethodSelection } from './shipping-method-selection';
import { PaymentMethodSelection } from './payment-method-selection';
import { OrderReview } from './order-review';

type CheckoutFormProps = {
  initialCart: CartType;
};

const SHIPPING_COSTS = {
  standard: 0.00,
  express: 10.00,
  overnight: 25.00,
};

export function CheckoutForm({ initialCart }: CheckoutFormProps) {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateOrderRequest>({
    resolver: zodResolver(CreateOrderRequestSchema),
    defaultValues: {
      shipping_info: {
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'US',
      },
      shipping_method: 'standard',
      payment_method: 'credit_card',
      cart_id: initialCart.cart_id,
    },
    mode: 'onBlur',
  });

  const watchedShippingMethod = form.watch('shipping_method');
  const shippingCost = SHIPPING_COSTS[watchedShippingMethod as keyof typeof SHIPPING_COSTS] || 0;

  const onSubmit = async (data: CreateOrderRequest) => {
    startTransition(async () => {
      const result = await createOrder(data);

      if (result.success && result.data) {
        // Clear cart
        clearCart();
        
        toast.success('Order placed successfully!');
        
        // Redirect to confirmation page
        const orderId = result.data.order_id.replace('order_', '');
        router.push(`/orders/${orderId}/confirmation`);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to place order');
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Forms */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShippingForm control={form.control} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShippingMethodSelection control={form.control} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentMethodSelection control={form.control} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Review */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderReview cart={initialCart} shippingCost={shippingCost} />
                  
                  <Button
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

