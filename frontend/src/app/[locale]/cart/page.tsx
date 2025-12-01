import { getTranslations } from 'next-intl/server';
import { CartView } from '@/components/cart/cart-view';
import { getCart } from '@/actions/cart-action';

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

  return <CartView initialCart={result.data} />;
}

