import { getTranslations } from 'next-intl/server';

import { ContactForm } from '@/components/contact/contact-form';
import { HomeHeader } from '@/components/home/home-header';
import { Banner } from '@/components/layout/banner';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: `Contact Us - ${t('title')}`,
  };
}

export default async function ContactPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />
      </div>

      <Banner />

      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
          <p className="text-gray-600 text-center mb-12">
            Have a question or feedback? We would love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>Send us an email</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">support@nexus.com</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phone</CardTitle>
                <CardDescription>Call us</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hours</CardTitle>
                <CardDescription>Business hours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Monday - Friday: 9AM - 6PM</p>
                <p className="text-gray-700">Saturday - Sunday: 10AM - 4PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Visit us</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  123 Commerce Street
                  <br />
                  San Francisco, CA 94102
                </p>
              </CardContent>
            </Card>
          </div>

          <ContactForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}

