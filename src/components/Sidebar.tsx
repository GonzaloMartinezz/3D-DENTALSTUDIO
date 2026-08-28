"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, Info, Phone, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  // Hide sidebar on root/login page
  if (pathname === '/' || pathname === '/login') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Portal Seguro', href: '/admin', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Pacientes', href: '/#portal-pacientes', icon: <Info className="w-5 h-5" /> },
    { name: 'Configuración', href: '#', icon: <Phone className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#3e2723] text-[#d4af37] shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'
        } bg-[#0a0806] border-r border-white/5`}
      >
        {/* Toggle button for desktop */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-4 top-8 bg-[#1a1512] border border-[#d4af37]/30 text-[#d4af37] p-1.5 rounded-full z-50 hover:bg-[#d4af37] hover:text-[#1a1512] transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Logo Section */}
        <div className="pt-8 pb-6 flex items-center justify-center px-4">
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 text-[#d4af37] flex items-center justify-center flex-shrink-0">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                 <path d="M12 21v-3" />
                 <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
               </svg>
            </div>
            {isOpen && (
              <h1 className="text-white font-black text-sm tracking-widest whitespace-nowrap overflow-hidden transition-all duration-300">
                3D DENTAL
              </h1>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            // For admin page, specifically highlight /admin
            const isActive = pathname === item.href || (pathname !== '/' && item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`relative flex items-center rounded-xl transition-all duration-200 group ${
                  isOpen ? 'px-4 py-3' : 'justify-center p-3 mx-auto w-12 h-12'
                } ${
                  isActive 
                    ? 'bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 shadow-sm' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
                title={!isOpen ? item.name : undefined}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                {isOpen && (
                  <span className="ml-3 font-semibold text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile / Logout Section */}
        <div className={`p-4 mt-auto border-t border-white/5`}>
          {isOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#1a1512] border border-white/10 flex items-center justify-center flex-shrink-0 text-[#d4af37] font-bold text-sm">
                  JD
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white leading-tight">Admin User</span>
                  <span className="text-xs text-[#d4af37] font-medium">Conectado</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1a1512] border border-white/10 flex items-center justify-center flex-shrink-0 text-[#d4af37] font-bold text-sm">
                JD
              </div>
              <button className="text-gray-400 hover:text-white transition-colors" title="Cerrar Sesión">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
