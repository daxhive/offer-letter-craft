'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Bell,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, href, active }) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
        : 'text-gray-500 hover:bg-gray-100'
      }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
    <span className="font-semibold text-sm">{label}</span>
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            LuxeHR
          </span>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
            active={pathname === '/dashboard'}
          />
          <SidebarItem
            icon={FilePlus}
            label="Create Offer"
            href="/dashboard/offers/create"
            active={pathname === '/dashboard/offers/create'}
          />
          <SidebarItem
            icon={FileText}
            label="All Offers"
            href="/dashboard/offers"
            active={pathname === '/dashboard/offers'}
          />
          <SidebarItem
            icon={Bell}
            label="Notifications"
            href="/dashboard/notifications"
            active={pathname === '/dashboard/notifications'}
          />
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-50">
        <div className="flex items-center space-x-3 mb-6 p-2 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'HR Manager'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.role || 'HR'}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
