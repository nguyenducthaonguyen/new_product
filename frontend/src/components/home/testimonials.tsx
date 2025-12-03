import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    content:
      'Amazing shopping experience! The products are high quality and shipping was super fast. Will definitely shop here again.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Verified Customer',
    content:
      'Great prices and excellent customer service. The website is easy to navigate and checkout was smooth. Highly recommended!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Verified Customer',
    content:
      'I love shopping at NEXUS! The product selection is fantastic and the quality exceeds my expectations. Best online store!',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Verified Customer',
    content:
      'Fast delivery, great packaging, and top-notch products. The return process was also hassle-free. 10/10 would recommend!',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map(testimonial => (
            <Card key={testimonial.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

