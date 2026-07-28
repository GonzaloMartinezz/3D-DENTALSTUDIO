import Link from 'next/link';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">C.O. Cárcara Martínez</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-6 mr-4">
            <Link href="/sobre-nosotros" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
              Sobre Nosotros
            </Link>
            <Link href="/contacto" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
              Contacto
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
