'use client';

import type { ProductListItem } from '@/entities/product';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

type ProductCardProps = {
  product: ProductListItem;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg';
  const rating = product.rating || 0;
  const reviewCount = product.review_count || 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              (
              {reviewCount}
              )
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <span className="text-2xl font-bold">
              {product.currency}
              {' '}
              {product.price.toFixed(2)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
