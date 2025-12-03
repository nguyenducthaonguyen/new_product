'use client';

import type { UserResponse } from '@/entities/user';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/actions/logout-action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserStore } from '@/stores/user-store';

type UserAvatarProps = {
  user: UserResponse;
};

export function UserAvatar({ user }: UserAvatarProps) {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const handleLogout = async (allDevices = false) => {
    try {
      // Clear user from Zustand store first (client-side)
      clearUser();
      // Then call server action to logout (clears cookies and redirects)
      await logout(allDevices);
      // Redirect will be handled by server action
      router.refresh();
    } catch (error) {
      console.error('[UserAvatar] Logout error:', error);
      // Even if logout fails, ensure user is cleared from store
      clearUser();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || undefined} alt={user.username} />
            <AvatarFallback>
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user.full_name && (
          <DropdownMenuItem className="flex flex-col items-start p-3">
            <span className="text-sm font-semibold">{user.full_name}</span>
          </DropdownMenuItem>
        )}
        {user.email && (
          <DropdownMenuItem className="flex flex-col items-start p-3">
            <span className="text-sm text-gray-600">{user.email}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleLogout(false)}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLogout(true)}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout All
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
