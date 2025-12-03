import { notFound, redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getOrder } from '@/actions/order-action';
import { Footer } from '@/components/layout/footer';
import { HomeHeader } from '@/components/home/home-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: `Order Confirmation - ${t('title')}`,
  };
}

export default async function OrderConfirmationPage(props: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { orderId } = await props.params;
  
  // Extract numeric ID from "order_{id}" format or use as-is
  const numericId = orderId.startsWith('order_') 
    ? parseInt(orderId.replace('order_', ''), 10)
    : parseInt(orderId, 10);

  if (Number.isNaN(numericId)) {
    notFound();
  }

  const result = await getOrder(numericId);

  if (!result.success || !result.data) {
    notFound();
  }

  const order = result.data;
  const deliveryInfo = order.delivery_info || {};
  const shippingCost = deliveryInfo.shipping_method === 'express' ? 10.00 : deliveryInfo.shipping_method === 'overnight' ? 25.00 : 0.00;
  const subtotal = order.total - shippingCost;
  const total = order.total;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-green-900">Order Confirmed!</h1>
                  <p className="text-green-700">
                    Thank you for your order. We have received your order and will process it shortly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">
                    ORD-
                    {order.id.toString().padStart(6, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-semibold">
                    USD
                    {' '}
                    {total.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold">{deliveryInfo.full_name || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">{deliveryInfo.email || 'N/A'}</p>
              <p className="text-sm text-muted-foreground">{deliveryInfo.phone || 'N/A'}</p>
              <p className="text-sm">
                {deliveryInfo.address || 'N/A'}
                {', '}
                {deliveryInfo.city || 'N/A'}
                {', '}
                {deliveryInfo.postal_code || 'N/A'}
              </p>
              <p className="text-sm">{deliveryInfo.country || 'N/A'}</p>
              {deliveryInfo.shipping_method && (
                <p className="text-sm text-muted-foreground mt-2">
                  Shipping Method:
                  {' '}
                  <span className="capitalize">{deliveryInfo.shipping_method}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-semibold">{item.product_name || `Product SKU: ${item.sku}`}</p>
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
                        {(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    USD
                    {' '}
                    {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    USD
                    {' '}
                    {shippingCost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
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

          {/* Actions */}
          <div className="flex gap-4">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/orders">View My Orders</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

