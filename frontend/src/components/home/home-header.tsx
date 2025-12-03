'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import type { UserResponse } from '@/entities/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserAvatar } from '@/components/user/user-avatar';
import { useCartStore } from '@/stores/cart-store';
import { useUserStore } from '@/stores/user-store';
import { fetchCurrentUser } from '@/lib/client-auth';

type HomeHeaderProps = {
  user?: UserResponse | null; // Make optional, we'll use Zustand as primary source
};

export function HomeHeader({ user: initialUser }: HomeHeaderProps) {
  const { user: zustandUser, setUser } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Use Zustand user as primary source, fallback to prop
  const user = zustandUser || initialUser;

  useEffect(() => {
    setMounted(true);
    // Only fetch once if not in Zustand store and we have access token
    if (!zustandUser && !hasFetched && typeof window !== 'undefined') {
      const hasToken = document.cookie.includes('access_token=');
      if (hasToken) {
        setHasFetched(true);
        fetchCurrentUser().then(result => {
          if (result.success && result.data) {
            setUser(result.data);
          }
        });
      }
    }
  }, [zustandUser, hasFetched, setUser]);

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const cart = useCartStore(state => state.cart);
  const cartItemCount = cart?.total_items || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Menu Button - Before Logo */}
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 active:bg-gray-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">NEXUS</span>
          </Link>

          {/* Search Input - Hidden on mobile, visible on tablet+ */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-lg mx-2 sm:mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>

          {/* Navigation Links - Desktop only */}
          <nav className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 active:bg-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side: Search Icon (Mobile) + Cart + Avatar/Login */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Search Icon Button - Mobile only */}
            <button
              type="button"
              onClick={() => router.push('/search')}
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Avatar or Login Button */}
            {mounted && (
              user
                ? (
                    <UserAvatar user={user} />
                  )
                : (
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        Login
                      </Button>
                    </Link>
                  )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
