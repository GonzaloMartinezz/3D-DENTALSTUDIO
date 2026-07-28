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
    { name: 'Inicio', href: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Servicios', href: '/servicios', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Sobre Nosotros', href: '/sobre-nosotros', icon: <Info className="w-5 h-5" /> },
    { name: 'Contacto', href: '/contacto', icon: <Phone className="w-5 h-5" /> },
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
        } bg-[#2c1e16]`}
        style={{
          backgroundImage: `linear-gradient(to bottom, #3e2723, #1a100c)`, // Simulating wood-like dark premium gradient
        }}
      >
        {/* Toggle button for desktop */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-4 top-8 bg-[#3e2723] border border-[#d4af37]/30 text-[#d4af37] p-1.5 rounded-full z-50 hover:bg-[#d4af37] hover:text-[#3e2723] transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Logo Section */}
        <div className="pt-10 pb-8 flex flex-col items-center justify-center border-b border-white/5">
          <div className="w-12 h-12 mb-3 text-[#d4af37] flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
               <path d="M12 22s-4-2-4-8c0-3 2-4 4-4s4 1 4 4c0 6-4 8-4 8z" />
               <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
               <path d="M10 10v2" />
               <path d="M14 10v2" />
             </svg>
          </div>
          {isOpen && (
            <h1 className="text-[#d4af37] font-bold text-lg whitespace-nowrap overflow-hidden transition-all duration-300">
              Centro Dental 3D
            </h1>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname !== '/' && pathname.startsWith(item.href) && item.href !== '/');
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`relative flex items-center ${isOpen ? 'px-6' : 'justify-center'} py-4 transition-colors group ${
                  isActive ? 'bg-white/5 text-[#d4af37]' : 'text-gray-400 hover:bg-white/5 hover:text-[#d4af37]'
                }`}
                title={!isOpen ? item.name : undefined}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d4af37]" />
                )}
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                {isOpen && (
                  <span className="ml-4 font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile / Logout Section */}
        <div className={`p-6 mt-auto ${!isOpen ? 'items-center px-0' : ''} border-t border-white/5`}>
          <div className={`bg-[#221610] rounded-xl p-4 flex flex-col items-center transition-all duration-300 ${!isOpen ? 'w-14 h-14 mx-auto p-2 justify-center rounded-full' : ''}`}>
            <div className={`rounded-full bg-gradient-to-br from-[#f5e6d3] to-[#d4af37] text-[#3e2723] font-bold flex items-center justify-center flex-shrink-0 shadow-lg ${isOpen ? 'w-16 h-16 text-xl mb-4' : 'w-10 h-10 text-sm'}`}>
              JD
            </div>
            
            {isOpen && (
              <button className="w-full py-2 px-4 rounded-full border border-[#d4af37]/50 text-[#d4af37] text-sm font-medium hover:bg-[#d4af37] hover:text-[#3e2723] transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            )}
            
            {!isOpen && (
              <button 
                className="mt-4 text-[#d4af37]/70 hover:text-[#d4af37] transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
