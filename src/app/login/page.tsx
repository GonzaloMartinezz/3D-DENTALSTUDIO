'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginPaciente, registrarPaciente } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regNombre, setRegNombre] = useState('');
  const [regDni, setRegDni] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await loginPaciente(loginEmail, loginPassword);
    if (error) {
      setLoginError('Correo o contraseña incorrectos.');
      setLoginLoading(false);
    } else {
      router.push(`/paciente?dni=${loginEmail}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    const { error } = await registrarPaciente(regDni, regPassword, regNombre, regEmail);
    if (error) {
      setRegError('Error al registrar.');
      setRegLoading(false);
    } else {
      await loginPaciente(regEmail, regPassword);
      router.push(`/paciente?dni=${regEmail}`);
    }
  };

  return (
    <div className="h-screen w-full bg-brand-beige font-sans relative overflow-hidden flex perspective-1000">
      
      {/* Back button to Home */}
      <div className="absolute top-6 left-6 z-50">
        <button onClick={() => router.push('/')} className="bg-brand-brown/10 backdrop-blur-md px-4 py-2 rounded-full text-brand-brown font-black hover:bg-brand-brown hover:text-white flex items-center gap-2 shadow-sm transition-all duration-300">
          ← Volver al Inicio
        </button>
      </div>

      {/* Main Animated Container */}
      <div className="relative w-full h-full overflow-hidden">
         
         {/* Sign Up Form Container (Left Side) */}
         <div className={`absolute top-0 h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] w-full md:w-1/2 left-0 ${isRightPanelActive ? 'translate-x-0 md:translate-x-[100%] opacity-100 z-50 scale-100' : 'translate-x-[-20%] opacity-0 z-10 pointer-events-none scale-90'}`}>
           <form onSubmit={handleRegister} className="flex flex-col items-center justify-center h-full px-10 sm:px-14 text-center w-full max-w-md mx-auto">
             <h1 className="text-4xl font-black text-brand-brown mb-4 drop-shadow-sm">Crear Cuenta</h1>
             
             <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-brand-brown/20 flex items-center justify-center cursor-pointer hover:bg-brand-brown hover:text-white text-brand-brown font-bold transition-colors">f</div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-brown/20 flex items-center justify-center cursor-pointer hover:bg-brand-brown hover:text-white text-brand-brown font-bold transition-colors">G+</div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-brown/20 flex items-center justify-center cursor-pointer hover:bg-brand-brown hover:text-white text-brand-brown font-bold transition-colors">in</div>
             </div>
             <span className="text-sm text-brand-brown/60 mb-6 font-bold">o usa tu email para el registro:</span>
             
             {regError && <span className="text-red-500 text-sm mb-2 font-bold">{regError}</span>}

             <div className="w-full space-y-3">
               <div className="relative w-full group">
                 <User className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50 group-hover:text-brand-brown transition-colors" />
                 <Input required placeholder="Nombre" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
               </div>
               <div className="relative w-full group">
                 <User className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50 group-hover:text-brand-brown transition-colors" />
                 <Input required placeholder="DNI o Identificación" value={regDni} onChange={(e) => setRegDni(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
               </div>
               <div className="relative w-full group">
                 <Mail className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50 group-hover:text-brand-brown transition-colors" />
                 <Input required type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
               </div>
               <div className="relative w-full group">
                 <Lock className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50 group-hover:text-brand-brown transition-colors" />
                 <Input required type="password" placeholder="Contraseña" minLength={6} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
               </div>
             </div>

             <Button type="submit" disabled={regLoading} className="mt-8 bg-brand-brown text-brand-beige hover:bg-brand-blue rounded-full px-14 py-6 text-sm font-black tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full max-w-[280px]">
               {regLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
             </Button>

             {/* Mobile Switch */}
             <button type="button" onClick={() => setIsRightPanelActive(false)} className="md:hidden mt-8 text-brand-brown font-black underline text-sm">
               ¿Ya tienes cuenta? Ingresa aquí
             </button>
           </form>
         </div>

         {/* Sign In Form Container (Left Side initially) */}
         <div className={`absolute top-0 h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] w-full md:w-1/2 left-0 z-20 ${isRightPanelActive ? 'translate-x-[20%] opacity-0 pointer-events-none scale-90' : 'translate-x-0 opacity-100 scale-100'}`}>
           <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-full px-10 sm:px-14 text-center w-full max-w-md mx-auto">
             <div className="flex items-center gap-3 mb-8">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-brown drop-shadow-md">
                 <path d="M12 21v-3" />
                 <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
               </svg>
               <h1 className="text-3xl font-black text-brand-brown tracking-tight">3D DENTAL</h1>
             </div>
             
             <h1 className="text-4xl font-black text-brand-brown mb-4 drop-shadow-sm">Iniciar Sesión</h1>
             
             <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-brand-brown/20 flex items-center justify-center cursor-pointer hover:bg-brand-brown hover:text-white text-brand-brown font-bold transition-colors">f</div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-brown/20 flex items-center justify-center cursor-pointer hover:bg-brand-brown hover:text-white text-brand-brown font-bold transition-colors">G+</div>
                <div className="w-10 h-10 rounded-full border-2 border-brand-brown/20 flex items-center justify-center cursor-pointer hover:bg-brand-brown hover:text-white text-brand-brown font-bold transition-colors">in</div>
             </div>
             <span className="text-sm text-brand-brown/60 mb-6 font-bold">o usa tu cuenta de email:</span>
             
             {loginError && <span className="text-red-500 text-sm mb-2 font-bold">{loginError}</span>}

             <div className="w-full space-y-3">
               <div className="relative w-full group">
                 <Mail className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50 group-hover:text-brand-brown transition-colors" />
                 <Input required type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
               </div>
               <div className="relative w-full group">
                 <Lock className="absolute left-4 top-3.5 w-5 h-5 text-brand-brown/50 group-hover:text-brand-brown transition-colors" />
                 <Input required type="password" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-white border-none pl-12 h-12 rounded-xl text-brand-dark font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-brand-brown" />
               </div>
             </div>
             
             <a href="#" className="text-sm font-bold text-brand-brown/60 mt-4 hover:text-brand-brown underline-offset-4 hover:underline transition-colors">¿Olvidaste tu contraseña?</a>
             
             <Button type="submit" disabled={loginLoading} className="mt-8 bg-brand-brown text-brand-beige hover:bg-brand-blue rounded-full px-14 py-6 text-sm font-black tracking-widest transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full max-w-[280px]">
               {loginLoading ? 'INGRESANDO...' : 'INGRESAR'}
             </Button>

             {/* Mobile Switch */}
             <button type="button" onClick={() => setIsRightPanelActive(true)} className="md:hidden mt-8 text-brand-brown font-black underline text-sm">
               ¿No tienes cuenta? Regístrate aquí
             </button>
           </form>
         </div>

         {/* Overlay Container (Hidden on Mobile, Desktop Only) */}
         <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] z-[100] ${isRightPanelActive ? '-translate-x-full rounded-r-[150px] rounded-l-none' : 'translate-x-0 rounded-l-[150px] rounded-r-none'} shadow-2xl`}>
           <div className={`absolute top-0 -left-full w-[200%] h-full bg-brand-brown transition-transform duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
             
             {/* Decorative Background Elements */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-10 mix-blend-multiply pointer-events-none" />
             <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-beige/10 rounded-full blur-3xl animate-pulse" />
             <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl" />

             {/* Overlay Left (Sign In text - visible when right panel is active) */}
             <div className={`absolute top-0 left-0 flex flex-col items-center justify-center w-1/2 h-full px-14 text-center text-brand-beige transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isRightPanelActive ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-[30%] opacity-0 scale-90'}`}>
               <h1 className="text-5xl font-black mb-6 drop-shadow-lg tracking-tight">¡Bienvenido!</h1>
               <p className="text-lg font-bold leading-relaxed mb-10 text-brand-beige/80 max-w-sm">
                 Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal
               </p>
               <button 
                 onClick={() => setIsRightPanelActive(false)}
                 className="bg-transparent border-2 border-brand-beige text-brand-beige rounded-full px-14 py-4 text-sm font-black tracking-widest hover:bg-brand-beige hover:text-brand-brown transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
               >
                 INGRESAR
               </button>
             </div>

             {/* Overlay Right (Sign Up text - visible when left panel is active) */}
             <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-14 text-center text-brand-beige transition-all duration-[1200ms] ease-[cubic-bezier(0.87,0,0.13,1)] ${isRightPanelActive ? 'translate-x-[30%] opacity-0 scale-90' : 'translate-x-0 opacity-100 scale-100'}`}>
               <h1 className="text-5xl font-black mb-6 drop-shadow-lg tracking-tight">¡Hola, Amigo!</h1>
               <p className="text-lg font-bold leading-relaxed mb-10 text-brand-beige/80 max-w-sm">
                 Ingresa tus detalles personales y comienza tu viaje con nosotros hacia una mejor sonrisa
               </p>
               <button 
                 onClick={() => setIsRightPanelActive(true)}
                 className="bg-transparent border-2 border-brand-beige text-brand-beige rounded-full px-14 py-4 text-sm font-black tracking-widest hover:bg-brand-beige hover:text-brand-brown transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
               >
                 REGISTRARSE
               </button>
             </div>
           </div>
         </div>

       </div>
    </div>
  );
}
