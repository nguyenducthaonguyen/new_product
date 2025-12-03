import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { HomeHeader } from '@/components/home/home-header';
import { Banner } from '@/components/layout/banner';
import { Footer } from '@/components/layout/footer';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: `About Us - ${t('title')}`,
  };
}

export default async function AboutPage(props: {
  params: Promise<{ locale: string }>;
}) {
  await props.params;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <Banner />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">About NEXUS</h1>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">
                NEXUS was founded with a simple mission: to provide high-quality
                products at affordable prices while delivering exceptional customer
                service. Since our inception, we have been committed to building
                a trusted online shopping platform that connects customers with
                the products they need.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to make online shopping easy, convenient, and enjoyable
                for everyone. Our team works tirelessly to curate the best products,
                ensure fast and reliable shipping, and provide outstanding customer
                support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Wide selection of quality products</li>
                <li>Competitive prices and regular promotions</li>
                <li>Fast and secure shipping</li>
                <li>24/7 customer support</li>
                <li>Easy returns and refunds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                Have questions or feedback? We would love to hear from you!
                {' '}
                Visit our
                {' '}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  contact page
                </Link>
                {' '}
                to get in touch with our team.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

