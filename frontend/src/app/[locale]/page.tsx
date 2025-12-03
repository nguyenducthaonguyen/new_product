import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/actions/product-action';
import { Banner } from '@/components/layout/banner';
import { Footer } from '@/components/layout/footer';
import { HomeHeader } from '@/components/home/home-header';
import { Features } from '@/components/home/features';
import { Testimonials } from '@/components/home/testimonials';
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
    title: t('title'),
  };
}

export default async function Index() {
  const result = await getProducts({ offset: 0, limit: 20 });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <Banner />

      <Features />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Featured Products</h1>
        <ProductList products={result.data || []} isLoading={false} />
      </div>

      <Testimonials />

      <Footer />
    </div>
  );
}
