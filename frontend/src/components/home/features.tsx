import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Shield, Headphones, Award } from 'lucide-react';

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $50. Fast and reliable delivery to your doorstep.',
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Secure Payment',
    description: 'Your payment information is safe and secure with our encrypted checkout system.',
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: '24/7 Support',
    description: 'Our customer support team is available around the clock to help you.',
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Quality Guarantee',
    description: 'We guarantee the quality of all our products. Not satisfied? Return it!',
  },
];

export function Features() {
  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose NEXUS?</h2>
          <p className="text-gray-600 text-lg">
            We're committed to providing you with the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

