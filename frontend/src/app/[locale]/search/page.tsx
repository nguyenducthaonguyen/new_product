import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/actions/product-action';
import { HomeHeader } from '@/components/home/home-header';
import { Footer } from '@/components/layout/footer';
import { ProductList } from '@/components/product/product-list';
import { SearchPageClient } from '@/components/search/search-page-client';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await props.params;
  const { q } = await props.searchParams;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  const searchQuery = q || '';
  const title = searchQuery 
    ? `Search: ${searchQuery} - ${t('title')}`
    : `Search - ${t('title')}`;

  return {
    title,
  };
}

export default async function SearchPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await props.params;
  const { q } = await props.searchParams;
  const searchQuery = q || '';

  // Fetch products with search query
  const result = await getProducts({
    offset: 0,
    limit: 50,
    search: searchQuery,
  });

  const products = result.success ? result.data : [];
  const hasResults = products.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {searchQuery ? `Search: "${searchQuery}"` : 'Search Products'}
          </h1>
          
          {searchQuery && (
            <p className="text-lg text-gray-600">
              {hasResults 
                ? `Found ${products.length} result${products.length !== 1 ? 's' : ''}`
                : 'No results found'}
            </p>
          )}
        </div>

        {!searchQuery ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Enter a search term to find products
            </p>
          </div>
        ) : hasResults ? (
          <ProductList products={products} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No products found for &quot;{searchQuery}&quot;
            </p>
            <p className="text-gray-400 text-sm">
              Try different keywords or browse our products
            </p>
          </div>
        )}
      </div>

      <Footer />
      <SearchPageClient searchQuery={searchQuery} />
    </div>
  );
}

