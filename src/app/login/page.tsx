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
    <div className="h-screen w-full bg-white font-sans relative overflow-hidden flex">
      
      {/* Back button to Home */}
      <div className="absolute top-6 left-6 z-50">
        <button onClick={() => router.push('/')} className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[#6F4E37] font-semibold hover:bg-white flex items-center gap-2 shadow-sm transition-colors">
          ← Volver al Inicio
        </button>
      </div>

      {/* Main Animated Container */}
      <div className="relative w-full h-full bg-white overflow-hidden">
         
         {/* Sign Up Form Container (Left Side) */}
         <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out w-full md:w-1/2 left-0 ${isRightPanelActive ? 'translate-x-0 md:translate-x-[100%] opacity-100 z-50' : 'opacity-0 z-10 pointer-events-none'}`}>
           <form onSubmit={handleRegister} className="flex flex-col items-center justify-center h-full px-10 sm:px-14 text-center bg-white w-full max-w-md mx-auto">
             <h1 className="text-3xl font-bold text-gray-800 mb-4">Crear Cuenta</h1>
             
             <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 font-bold">f</div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 font-bold">G+</div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 font-bold">in</div>
             </div>
             <span className="text-sm text-gray-500 mb-6">o usa tu email para el registro:</span>
             
             {regError && <span className="text-red-500 text-sm mb-2">{regError}</span>}

             <div className="w-full space-y-3">
               <div className="relative w-full">
                 <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                 <Input required placeholder="Nombre" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} className="bg-[#f3f4f6] border-none pl-10 h-11 rounded-lg text-sm" />
               </div>
               <div className="relative w-full">
                 <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                 <Input required placeholder="DNI o Identificación" value={regDni} onChange={(e) => setRegDni(e.target.value)} className="bg-[#f3f4f6] border-none pl-10 h-11 rounded-lg text-sm" />
               </div>
               <div className="relative w-full">
                 <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                 <Input required type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="bg-[#f3f4f6] border-none pl-10 h-11 rounded-lg text-sm" />
               </div>
               <div className="relative w-full">
                 <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                 <Input required type="password" placeholder="Contraseña" minLength={6} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="bg-[#f3f4f6] border-none pl-10 h-11 rounded-lg text-sm" />
               </div>
             </div>

             <Button type="submit" disabled={regLoading} className="mt-8 bg-[#6F4E37] text-white hover:bg-[#5a3e2b] rounded-full px-14 py-6 text-sm font-bold tracking-wider transition-colors shadow-lg">
               {regLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
             </Button>

             {/* Mobile Switch (visible only on small screens) */}
             <button type="button" onClick={() => setIsRightPanelActive(false)} className="md:hidden mt-6 text-[#6F4E37] underline text-sm">
               ¿Ya tienes cuenta? Ingresa aquí
             </button>
           </form>
         </div>

         {/* Sign In Form Container (Left Side initially) */}
         <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out w-full md:w-1/2 left-0 z-20 ${isRightPanelActive ? 'translate-x-[100%] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
           <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-full px-10 sm:px-14 text-center bg-white w-full max-w-md mx-auto">
             <div className="flex items-center gap-3 mb-8">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6F4E37" strokeWidth="1.5" className="drop-shadow-sm">
                 <path d="M12 21v-3" />
                 <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
               </svg>
               <h1 className="text-2xl font-bold text-[#6F4E37]">Centro Dental 3D</h1>
             </div>
             
             <h1 className="text-3xl font-bold text-gray-800 mb-4">Iniciar Sesión</h1>
             
             <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 font-bold">f</div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 font-bold">G+</div>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-600 font-bold">in</div>
             </div>
             <span className="text-sm text-gray-500 mb-6">o usa tu cuenta de email:</span>
             
             {loginError && <span className="text-red-500 text-sm mb-2">{loginError}</span>}

             <div className="w-full space-y-3">
               <div className="relative w-full">
                 <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                 <Input required type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="bg-[#f3f4f6] border-none pl-10 h-11 rounded-lg text-sm" />
               </div>
               <div className="relative w-full">
                 <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                 <Input required type="password" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="bg-[#f3f4f6] border-none pl-10 h-11 rounded-lg text-sm" />
               </div>
             </div>
             
             <a href="#" className="text-sm text-gray-500 mt-4 hover:text-[#6F4E37] underline-offset-4 hover:underline">¿Olvidaste tu contraseña?</a>
             
             <Button type="submit" disabled={loginLoading} className="mt-8 bg-[#6F4E37] text-white hover:bg-[#5a3e2b] rounded-full px-14 py-6 text-sm font-bold tracking-wider transition-colors shadow-lg">
               {loginLoading ? 'INGRESANDO...' : 'INGRESAR'}
             </Button>

             {/* Mobile Switch (visible only on small screens) */}
             <button type="button" onClick={() => setIsRightPanelActive(true)} className="md:hidden mt-6 text-[#6F4E37] underline text-sm">
               ¿No tienes cuenta? Regístrate aquí
             </button>
           </form>
         </div>

         {/* Overlay Container (Hidden on Mobile, Desktop Only) */}
         <div className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isRightPanelActive ? '-translate-x-full' : 'translate-x-0'}`}>
           <div className={`absolute top-0 -left-full w-[200%] h-full bg-[#6F4E37] transition-transform duration-700 ease-in-out ${isRightPanelActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
             
             {/* Decorative Background Elements */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-20 mix-blend-multiply pointer-events-none" />
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
             <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-2xl" />

             {/* Overlay Left (Sign In text - visible when right panel is active) */}
             <div className={`absolute top-0 left-0 flex flex-col items-center justify-center w-1/2 h-full px-14 text-center text-white transition-transform duration-700 ease-in-out ${isRightPanelActive ? 'translate-x-0' : '-translate-x-[20%]'}`}>
               <h1 className="text-4xl font-bold mb-6 drop-shadow-sm">¡Bienvenido!</h1>
               <p className="text-[15px] font-light leading-relaxed mb-10 text-white/90">
                 Para mantenerte conectado con nosotros, por favor inicia sesión con tu información personal
               </p>
               <button 
                 onClick={() => setIsRightPanelActive(false)}
                 className="bg-transparent border-2 border-white text-white rounded-full px-12 py-3 text-sm font-bold tracking-wider hover:bg-white hover:text-[#6F4E37] transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
               >
                 INGRESAR
               </button>
             </div>

             {/* Overlay Right (Sign Up text - visible when left panel is active) */}
             <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-14 text-center text-white transition-transform duration-700 ease-in-out ${isRightPanelActive ? 'translate-x-[20%]' : 'translate-x-0'}`}>
               <h1 className="text-4xl font-bold mb-6 drop-shadow-sm">¡Hola, Amigo!</h1>
               <p className="text-[15px] font-light leading-relaxed mb-10 text-white/90">
                 Ingresa tus detalles personales y comienza tu viaje con nosotros hacia una mejor sonrisa
               </p>
               <button 
                 onClick={() => setIsRightPanelActive(true)}
                 className="bg-transparent border-2 border-white text-white rounded-full px-12 py-3 text-sm font-bold tracking-wider hover:bg-white hover:text-[#6F4E37] transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
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
