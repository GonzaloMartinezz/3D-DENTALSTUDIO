'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Send, Users, FileBox, Settings, LogOut } from 'lucide-react';
import { cerrarSesion } from '@/services/authService';

const SECCIONES = [
  { href: '/admin', nombre: 'Resumen', corto: 'Resumen', icono: LayoutDashboard, exacto: true },
  { href: '/admin/portal', nombre: 'Enviar estudio', corto: 'Enviar', icono: Send, destacada: true },
  { href: '/admin/pacientes', nombre: 'Pacientes', corto: 'Pacientes', icono: Users },
  { href: '/admin/estudios', nombre: 'Estudios', corto: 'Estudios', icono: FileBox },
  { href: '/admin/configuracion', nombre: 'Configuración', corto: 'Ajustes', icono: Settings },
];

export default function AdminShell({ nombre, clinica, children }: { nombre: string; clinica: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activa = (href: string, exacto?: boolean) => (exacto ? pathname === href : pathname.startsWith(href));

  const salir = async () => {
    await cerrarSesion();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-brand-dark font-[family-name:var(--font-geist-sans)]">
      {/* Barra superior */}
      <header className="sticky top-0 z-30 bg-brand-brown text-brand-beige shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 shrink-0" aria-label="Inicio del panel">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M12 21v-3" />
              <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
            </svg>
            <span className="font-heading text-lg tracking-wider truncate max-w-[10rem] sm:max-w-none">{clinica}</span>
          </Link>

          {/* Navegación en pantallas medianas y grandes */}
          <nav aria-label="Secciones del panel" className="hidden md:flex flex-1 items-center justify-center gap-1">
            {SECCIONES.map(({ href, nombre: n, icono: Icono, exacto, destacada }) => (
              <Link
                key={href}
                href={href}
                aria-current={activa(href, exacto) ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  activa(href, exacto)
                    ? 'bg-brand-beige text-brand-brown'
                    : destacada
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'text-brand-beige/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icono className="h-4 w-4" aria-hidden /> {n}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden lg:block text-right leading-tight">
              <div className="text-sm font-bold text-white">{nombre}</div>
              <div className="text-xs text-brand-beige/70">Administrador</div>
            </div>
            <button
              onClick={salir}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-beige transition-colors hover:bg-white/20 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido: deja lugar a la barra inferior en celulares */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 pb-28 md:pb-10 space-y-6 sm:space-y-8">{children}</main>

      {/* Navegación inferior en celulares (fácil de alcanzar con el pulgar, también en horizontal) */}
      <nav
        aria-label="Secciones del panel"
        className="md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-brand-brown/10 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {SECCIONES.map(({ href, corto, icono: Icono, exacto }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={activa(href, exacto) ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${activa(href, exacto) ? 'text-brand-brown' : 'text-brand-dark/50'}`}
              >
                <span className={`flex h-7 w-12 items-center justify-center rounded-full ${activa(href, exacto) ? 'bg-brand-beige' : ''}`}>
                  <Icono className="h-5 w-5" aria-hidden />
                </span>
                {corto}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
