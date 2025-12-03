import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getCart } from '@/actions/cart-action';
import { Footer } from '@/components/layout/footer';
import { HomeHeader } from '@/components/home/home-header';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: `Checkout - ${t('title')}`,
  };
}

export default async function CheckoutPage() {
  const result = await getCart();

  // Redirect to cart if cart is empty
  if (!result.data || !result.data.items || result.data.items.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <CheckoutForm initialCart={result.data} />
      </div>

      <Footer />
    </div>
  );
}

