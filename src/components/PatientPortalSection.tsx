'use client';

import React, { useState } from 'react';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import SecurePatientDashboard from './SecurePatientDashboard';

export default function PatientPortalSection() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || !password) {
      setError('Por favor, completa ambos campos.');
      return;
    }
    
    setError('');
    setLoading(true);

    // Simulación de validación de backend / Supabase Auth
    // En producción aquí iría: await supabase.auth.signInWithPassword({ email: `\${dni}@pacientes.com`, password })
    setTimeout(() => {
      setLoading(false);
      if (dni.length >= 7 && password.length >= 4) {
        setIsAuthenticated(true);
      } else {
        setError('Credenciales incorrectas. Verifica tu DNI o PIN.');
      }
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDni('');
    setPassword('');
  };

  return (
    <section className="w-full bg-background border-t border-border/50 py-24 relative overflow-hidden" id="portal-pacientes">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-3/4 bg-brand-brown/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Encabezado de la Sección */}
        {!isAuthenticated && (
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black font-heading text-white mb-4 tracking-tight">Portal de <span className="text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Resultados</span></h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
              Ingresa con tu DNI y la contraseña que te proporcionamos en la clínica para descargar tus estudios tridimensionales e informes interactivos.
            </p>
          </div>
        )}

        {/* Vista dinámica */}
        {isAuthenticated ? (
          <SecurePatientDashboard userDni={dni} onLogout={handleLogout} />
        ) : (
          <div className="max-w-md mx-auto bg-[#0a0806]/80 backdrop-blur-xl text-white p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            {/* Subtle gradient glow behind form */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#d4af37]/5 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
            
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300 ml-1" htmlFor="dni-input">Documento (DNI)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="dni-input"
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Ej. 35123456"
                    className="w-full bg-[#1a1512] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 transition-all text-base shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-gray-300" htmlFor="pwd-input">Contraseña / PIN</label>
                  <button type="button" className="text-xs font-bold text-[#d4af37] hover:text-white transition-colors hover:underline">¿Olvidaste el PIN?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="pwd-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1a1512] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 transition-all text-base shadow-inner"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold p-4 rounded-xl flex items-center justify-center animate-in fade-in" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] text-[#1a1512] hover:bg-white hover:text-black py-4 rounded-2xl font-black text-lg flex justify-center items-center space-x-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 focus:ring-offset-[#0a0806] mt-8 disabled:opacity-70 disabled:hover:bg-[#d4af37] disabled:hover:text-[#1a1512]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Acceder a mis Estudios</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </section>
  );
}
