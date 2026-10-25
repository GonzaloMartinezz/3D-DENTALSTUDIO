'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { iniciarSesion } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, User } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const sinPerfil = useSearchParams().get('error') === 'sin-perfil';
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(sinPerfil ? 'Tu cuenta no tiene un perfil asociado. Contactá a la clínica.' : '');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    const { error } = await iniciarSesion(identificador, password);
    if (error) {
      setError('DNI o contraseña incorrectos.');
      setCargando(false);
      return;
    }
    router.replace('/paciente'); // /paciente deriva a /admin si el usuario es administrador
    router.refresh();
  };

  return (
    <div className="min-h-screen w-full bg-brand-beige font-sans relative overflow-x-hidden flex">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button onClick={() => router.push('/')} className="bg-brand-brown/10 backdrop-blur-md px-4 py-2 rounded-full text-brand-brown font-black hover:bg-brand-brown hover:text-white flex items-center gap-2 shadow-sm transition-all duration-300">
          ← Volver al Inicio
        </button>
      </div>

      <div className="relative w-full min-h-screen flex">
        <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center py-24 md:py-10">
          <form onSubmit={handleLogin} className="flex flex-col items-center justify-center px-6 sm:px-14 text-center w-full max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-brown drop-shadow-md">
                <path d="M12 21v-3" />
                <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
              </svg>
              <h1 className="text-3xl font-black text-brand-brown tracking-tight">3D DENTAL</h1>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-brand-brown mb-2 drop-shadow-sm">Portal de Pacientes</h2>
            <p className="text-sm text-brand-brown/60 mb-8 font-bold">Ingresá con tu DNI y la contraseña que te dio la clínica.</p>

            {error && <span role="alert" className="text-red-600 text-sm mb-3 font-bold">{error}</span>}

            <div className="w-full space-y-3">
              <div className="relative w-full">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50" />
                <Input required autoComplete="username" placeholder="DNI" value={identificador} onChange={(e) => setIdentificador(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
              </div>
              <div className="relative w-full">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50" />
                <Input required type="password" autoComplete="current-password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
              </div>
            </div>

            <Button type="submit" disabled={cargando} className="mt-8 bg-brand-brown text-brand-beige hover:bg-brand-blue rounded-full px-14 py-6 text-sm font-black tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full max-w-[280px]">
              {cargando ? 'INGRESANDO...' : 'INGRESAR'}
            </Button>

            <p className="mt-6 text-xs text-brand-brown/60 font-bold">¿Olvidaste tu contraseña? Pedí una nueva en recepción.</p>
          </form>
        </div>

        <div className="hidden md:flex w-1/2 min-h-screen bg-brand-brown rounded-l-[150px] shadow-2xl relative overflow-hidden flex-col items-center justify-center px-14 text-center text-brand-beige">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-beige/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl" />
          <h2 className="text-5xl font-black mb-6 drop-shadow-lg tracking-tight relative">Tus estudios, siempre a mano</h2>
          <p className="text-lg font-bold leading-relaxed text-brand-beige/80 max-w-sm relative">
            Descargá tus radiografías y tomografías de forma segura, cuando las necesites.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
