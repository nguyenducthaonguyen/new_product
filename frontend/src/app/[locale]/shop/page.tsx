import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/actions/product-action';
import { Banner } from '@/components/layout/banner';
import { Footer } from '@/components/layout/footer';
import { HomeHeader } from '@/components/home/home-header';
import { ProductList } from '@/components/product/product-list';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: `Shop - ${t('title')}`,
  };
}

export default async function ShopPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const result = await getProducts({ offset: 0, limit: 50 });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <Banner />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Shop All Products</h1>
          <p className="text-gray-600">
            Discover our wide selection of quality products
          </p>
        </div>

        <ProductList products={result.data || []} isLoading={false} />
      </div>

      <Footer />
    </div>
  );
}

