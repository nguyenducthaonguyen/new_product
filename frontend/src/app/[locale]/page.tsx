import { getTranslations } from 'next-intl/server';
import { ProductList } from '@/components/product/product-list';
import { getProducts } from '@/actions/product-action';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: t('title'),
  };
}

export default async function Index() {
  const result = await getProducts({ offset: 0, limit: 20 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <ProductList products={result.data || []} isLoading={false} />
    </div>
  );
}
