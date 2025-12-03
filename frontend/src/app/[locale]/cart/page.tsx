import { getTranslations } from 'next-intl/server';
import { getCart } from '@/actions/cart-action';
import { Footer } from '@/components/layout/footer';
import { HomeHeader } from '@/components/home/home-header';
import { CartView } from '@/components/cart/cart-view';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: `Cart - ${t('title')}`,
  };
}

export default async function CartPage() {
  const result = await getCart();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <div className="container mx-auto px-4 py-8 flex-1">
        <CartView initialCart={result.data} />
      </div>

      <Footer />
    </div>
  );
}
