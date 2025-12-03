import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/actions/product-action';
import { Footer } from '@/components/layout/footer';
import { HomeHeader } from '@/components/home/home-header';
import { ProductDetailView } from '@/components/product/product-detail-view';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  const result = await getProductBySlug(slug);
  const product = result.data;

  return {
    title: product ? product.name : t('title'),
    description: product?.description || '',
  };
}

export default async function ProductDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await props.params;
  const result = await getProductBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <ProductDetailView product={result.data} />

      <Footer />
    </div>
  );
}
