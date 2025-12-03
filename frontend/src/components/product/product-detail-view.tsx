'use client';

import type { ProductDetail, ProductVariant } from '@/entities/product';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { addToCart } from '@/actions/cart-action';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';

type ProductDetailViewProps = {
  product: ProductDetail;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { setCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract unique colors and sizes from variants
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    product.variants.forEach(v => {
      if (v.color) colors.add(v.color);
    });
    return Array.from(colors);
  }, [product.variants]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    product.variants.forEach(v => {
      if (v.size) sizes.add(v.size);
    });
    return Array.from(sizes);
  }, [product.variants]);

  // Filter variants based on selected color and size
  const filteredVariants = useMemo(() => {
    return product.variants.filter(v => {
      if (selectedColor && v.color !== selectedColor) return false;
      if (selectedSize && v.size !== selectedSize) return false;
      return true;
    });
  }, [product.variants, selectedColor, selectedSize]);

  // Get available sizes for selected color
  const availableSizesForColor = useMemo(() => {
    if (!selectedColor) return availableSizes;
    const sizes = new Set<string>();
    product.variants.forEach(v => {
      if (v.color === selectedColor && v.size) {
        sizes.add(v.size);
      }
    });
    return Array.from(sizes);
  }, [product.variants, selectedColor, availableSizes]);

  // Get available colors for selected size
  const availableColorsForSize = useMemo(() => {
    if (!selectedSize) return availableColors;
    const colors = new Set<string>();
    product.variants.forEach(v => {
      if (v.size === selectedSize && v.color) {
        colors.add(v.color);
      }
    });
    return Array.from(colors);
  }, [product.variants, selectedSize, availableColors]);

  // Get selected variant
  const selectedVariant = useMemo(() => {
    return filteredVariants.find(v => v.stock > 0) || filteredVariants[0] || null;
  }, [filteredVariants]);

  // Initialize default selections
  useEffect(() => {
    if (mounted && availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
    if (mounted && availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [mounted, availableColors, availableSizes, selectedColor, selectedSize]);

  // Reset quantity when variant changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // If current size is not available for new color, reset size
    const sizesForColor = product.variants
      .filter(v => v.color === color && v.size)
      .map(v => v.size!);
    if (selectedSize && !sizesForColor.includes(selectedSize)) {
      setSelectedSize(sizesForColor[0] || null);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // If current color is not available for new size, reset color
    const colorsForSize = product.variants
      .filter(v => v.size === size && v.color)
      .map(v => v.color!);
    if (selectedColor && !colorsForSize.includes(selectedColor)) {
      setSelectedColor(colorsForSize[0] || null);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedVariant) return;
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

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
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsAdding(false);
    }
  };

  const finalPrice = selectedVariant
    ? product.price + selectedVariant.price_modifier
    : product.price;

  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;
  const maxQuantity = selectedVariant ? Math.min(selectedVariant.stock, 10) : 1;

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square w-full bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded" />
            <div className="h-6 bg-muted animate-pulse rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 lg:gap-12">
        {/* Left: Gallery (60%) */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-white">
            <Image
              src={product.images[selectedImageIndex] || product.images[0] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300 hover:scale-110 transition-transform"
              priority
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square w-full overflow-hidden rounded-lg border transition-all ${
                    selectedImageIndex === index
                      ? 'ring-2 ring-black'
                      : 'hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info (40%) */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                (
                {product.review_count}
                {' '}
                reviews)
              </span>
            </div>
            <p className="text-3xl font-bold">
              {product.currency}
              {' '}
              {finalPrice.toFixed(2)}
            </p>
          </div>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">COLOR SELECTION</label>
              <div className="flex flex-wrap gap-3">
                {availableColors.map(color => {
                  const isAvailable = availableColorsForSize.includes(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      disabled={!isAvailable}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'border-black ring-2 ring-black ring-offset-2'
                          : 'border-gray-300 hover:border-gray-500'
                      } ${
                        !isAvailable
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">SIZE SELECTOR</label>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map(size => {
                  const isAvailable = availableSizesForColor.includes(size);
                  const isSelected = selectedSize === size;
                  const variantForSize = product.variants.find(
                    v => v.size === size && v.color === selectedColor,
                  );
                  const isOutOfStockForSize = variantForSize?.stock === 0;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      disabled={!isAvailable || isOutOfStockForSize}
                      className={`px-4 py-2 border-2 rounded transition-all ${
                        isSelected
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-500'
                      } ${
                        !isAvailable || isOutOfStockForSize
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          {selectedVariant && selectedVariant.stock > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800"
            size="lg"
          >
            {isAdding
              ? (
                  <>
                    <span className="mr-2">Adding...</span>
                  </>
                )
              : isOutOfStock
                ? (
                    'Out of Stock'
                  )
                : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
          </Button>

          {/* Description */}
          {product.description && (
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
