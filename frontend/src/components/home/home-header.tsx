'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart } from 'lucide-react';
import type { UserResponse } from '@/entities/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <header className="flex h-16 items-center justify-between gap-4 border-b pb-4 mb-4">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
        <span className="text-2xl font-bold text-gray-900">NEXUS</span>
      </Link>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-4">
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

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right Side: Cart + Avatar/Login */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Cart Icon */}
        <Link
          href="/cart"
          className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white">
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </span>
          )}
        </Link>

        {/* Avatar or Login Button */}
        {user
          ? (
              <UserAvatar user={user} />
            )
          : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
      </div>
    </header>
  );
}
