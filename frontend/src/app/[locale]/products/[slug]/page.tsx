import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProductBySlug } from '@/actions/product-action';
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

  return <ProductDetailView product={result.data} />;
}

