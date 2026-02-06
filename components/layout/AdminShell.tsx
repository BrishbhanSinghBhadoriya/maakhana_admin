'use client';

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
  LucideIcon,
} from 'lucide-react';

type NavKey = 'dashboard' | 'products' | 'orders' | 'customers' | 'settings';

interface NavItem {
  key: NavKey;
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: TrendingUp },
  { key: 'products', label: 'Products', href: '/product', icon: Package },
  { key: 'orders', label: 'Orders', href: '/orders', icon: ShoppingCart },
  { key: 'customers', label: 'Customers', href: '/users', icon: Users },
  { key: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeKey = useMemo<NavKey>(() => {
    const activeItem = navItems.find((item) =>
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    return activeItem?.key ?? 'dashboard';
  }, [pathname]);

  const handleNavigate = (item: NavItem): void => {
    if (pathname !== item.href) {
      router.push(item.href);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const params = new URLSearchParams(window.location.search);
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      router.push(`${pathname}?${params.toString()}`);
      setIsSearchOpen(false);
    }
  };

const handleLogout = () => {
  document.cookie = "auth=; Max-Age=0; path=/";

  window.location.href = "/login";
};
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-transform duration-300 z-40 w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
             <Image
             src="/maakhana.jpeg" 
             alt="Package"
             width={48}
             height={48}
             className="object-contain"
             />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">Maakhana</h1>
              <p className="text-xs text-gray-500"></p>
            </div>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigate(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeKey === item.key
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">           
           <button onClick={handleLogout}  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
           <LogOut className="w-5 h-5" />
           <span>Logout</span>
           </button>
         
        </div>
      </aside>

      {/* Main Content */}
      <div className="transition-all duration-300 md:ml-64 ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 lg:w-80"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>

              <button
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition" aria-label="Notifications">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  className="flex items-center space-x-3 pl-2 sm:pl-4 sm:border-l hover:bg-gray-50 rounded-lg p-1 transition"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">AS</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-semibold text-sm">Admin User</p>
                    <p className="text-xs text-gray-500">admin@makhana.com</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border z-50">
                    <div className="px-4 py-2 border-b md:hidden">
                      <p className="font-semibold text-sm">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@makhana.com</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isSearchOpen && (
            <div className="md:hidden px-4 pb-4 border-t pt-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
            </div>
          )}
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
