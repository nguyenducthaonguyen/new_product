'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import type { ProductDetail, ProductVariant } from '@/entities/product';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { addToCart } from '@/actions/cart-action';
import { useCartStore } from '@/stores/cart-store';

interface ProductDetailViewProps {
  product: ProductDetail;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.find((v) => v.stock > 0) || product.variants[0] || null,
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { setCart } = useCartStore();

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error('Please select a variant');
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    setIsAdding(true);
    try {
      const result = await addToCart({
        sku: selectedVariant.sku,
        quantity,
      });

      if (result.success && result.data) {
        setCart(result.data);
        toast.success(result.message || 'Item added to cart');
      } else {
        toast.error(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsAdding(false);
    }
  };

  const availableVariants = product.variants.filter((v) => v.stock > 0);
  const finalPrice = selectedVariant
    ? product.price + selectedVariant.price_modifier
    : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
            <Image
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square w-full overflow-hidden rounded-lg border"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">({product.review_count} reviews)</span>
            </div>
            <p className="text-3xl font-bold mb-4">
              {product.currency} {finalPrice.toFixed(2)}
            </p>
          </div>

          {product.description && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Variant Selection */}
          {product.variants.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Variant</label>
                <Select
                  value={selectedVariant?.sku || ''}
                  onValueChange={(sku) => {
                    const variant = product.variants.find((v) => v.sku === sku);
                    setSelectedVariant(variant || null);
                    setQuantity(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem
                        key={variant.sku}
                        value={variant.sku}
                        disabled={variant.stock === 0}
                      >
                        {[
                          variant.color,
                          variant.size,
                          variant.stock > 0 ? `Stock: ${variant.stock}` : 'Out of Stock',
                        ]
                          .filter(Boolean)
                          .join(' - ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedVariant && selectedVariant.stock > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity</label>
                  <Select
                    value={quantity.toString()}
                    onValueChange={(value) => setQuantity(parseInt(value, 10))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: Math.min(selectedVariant.stock, 10) }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0 || isAdding}
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </Button>

          {selectedVariant && selectedVariant.stock === 0 && (
            <p className="text-sm text-destructive">This variant is out of stock</p>
          )}
        </div>
      </div>
    </div>
  );
}

