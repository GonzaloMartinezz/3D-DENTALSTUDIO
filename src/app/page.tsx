import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col bg-brand-brown min-h-screen font-sans text-brand-dark overflow-x-hidden">
      
      {/* 1. Unified Notched Hero Card */}
      <div className="bg-brand-beige mx-4 sm:mx-6 md:mx-10 mt-4 mb-12 rounded-[3rem] relative overflow-hidden flex flex-col min-h-[85vh] shadow-2xl">
        
        {/* Background Image on Right Half */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 overflow-hidden pointer-events-none z-0">
          <img src="https://images.unsplash.com/photo-1598934571731-97b4ec8b9813?q=80&w=1000" className="w-full h-full object-cover object-center opacity-80 mix-blend-multiply" alt="Paciente" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-beige via-brand-beige/50 to-transparent"></div>
        </div>

        {/* Top Notch (Navigation) */}
        <div className="notch-top flex items-center justify-center gap-3 sm:gap-6 md:gap-10 text-brand-beige font-medium text-xs sm:text-sm md:text-base px-2">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <Link href="#servicios" className="hover:text-white transition-colors">Servicios</Link>
          <Link href="#contacto" className="hover:text-white transition-colors">Contacto</Link>
          <div className="w-px h-5 bg-brand-beige/20 mx-2"></div>
          <Link href="/login" className="hover:text-white transition-colors flex items-center gap-2">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
             Ayuda
          </Link>
        </div>

        {/* Header content outside notch (Logo Left, Buttons Right) */}
        <div className="w-full flex justify-between items-center pl-8 md:pl-16 lg:pl-20 pr-6 md:pr-8 lg:pr-10 pt-10 relative z-20">
          <div className="flex items-center gap-2 text-brand-brown">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="drop-shadow-sm text-brand-brown">
               <path d="M12 21v-3" />
               <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
            </svg>
            <span className="font-black tracking-wider text-xl">3D DENTAL STUDIO</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="hidden lg:inline-flex px-6 py-2.5 rounded-full border border-brand-brown text-brand-brown hover:bg-brand-brown hover:text-white transition-colors font-bold text-sm items-center shadow-sm">
              Iniciar Sesión
            </Link>
            <Link href="/login" className="px-6 py-2.5 rounded-full bg-brand-brown text-brand-beige font-black hover:bg-brand-blue transition-colors text-sm flex items-center shadow-lg">
              Registrarse
            </Link>
          </div>
        </div>

        {/* Hero Content Area */}
        <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-20 pb-24 pt-12 relative z-20 gap-12">
          
          <div className="w-full md:w-1/2 text-left flex flex-col items-start">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-brown mb-8 leading-[1.05] drop-shadow-sm">
              Diagnóstico <br/>Dental 3D de<br/> Precisión.
            </h1>
            <p className="text-brand-brown/80 mb-10 max-w-md text-lg leading-relaxed font-bold">
              Desde gestión fácil de pacientes, hasta diagnósticos inteligentes. Abre tu cuenta en un instante con nosotros.
            </p>

          </div>
          
          <div className="w-full md:w-1/2 relative flex justify-center md:justify-end mt-12 md:mt-0">
             <div className="bg-white/10 backdrop-blur-2xl w-full max-w-[420px] rounded-[2.5rem] p-4 shadow-2xl relative border border-white/40">
               <div className="bg-[#18181b] w-full rounded-[2rem] p-8 shadow-inner relative overflow-hidden border border-white/5">
                 <div className="flex justify-between items-start mb-10">
                   <div className="flex items-center gap-2 text-white">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                     <span className="font-bold tracking-wider text-sm">3D DENTAL STUDIO</span>
                   </div>
                   <div className="bg-brand-brown/20 border border-brand-brown/50 px-4 py-1.5 rounded-full text-brand-beige font-bold text-xs flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-beige animate-pulse"></span>
                     Estudios
                   </div>
                 </div>
                 
                 <div className="mb-2 text-white/50 text-xs font-bold uppercase tracking-widest">Balance Clínicas</div>
                 <div className="text-4xl font-black text-white mb-6">$45,897.00</div>
                 <div className="text-white/40 font-mono tracking-widest text-sm mb-10">**** **** **** 8767</div>
                 
                 <div className="flex justify-between items-end">
                   <div className="text-white/60 text-xs font-bold uppercase tracking-wider">DAVID MARTIN<br/><span className="text-white/40 text-[10px]">18/35</span></div>
                   <div className="bg-brand-beige text-brand-brown font-black px-3 py-1 rounded-full text-xs uppercase tracking-widest shadow-md">
                     PRO
                   </div>
                 </div>
               </div>
             </div>
          </div>

        </div>
        
        {/* Bottom Notch for Badges */}
        <div className="notch-bottom flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 px-4 sm:px-12 pt-2">
           <Link href="#turnos" className="flex items-center gap-2.5 bg-brand-beige/10 hover:bg-brand-beige text-brand-beige hover:text-brand-brown px-4 sm:px-5 py-1.5 sm:py-2.5 rounded-full border border-brand-beige/20 transition-all cursor-pointer shadow-sm group">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             <div className="font-bold text-xs uppercase tracking-widest">Sacar Turnos</div>
           </Link>
           <Link href="#nosotros" className="flex items-center gap-2.5 bg-brand-beige/10 hover:bg-brand-beige text-brand-beige hover:text-brand-brown px-4 sm:px-5 py-1.5 sm:py-2.5 rounded-full border border-brand-beige/20 transition-all cursor-pointer shadow-sm group">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
             <div className="font-bold text-xs uppercase tracking-widest">Conocer 3D Dental</div>
           </Link>
        </div>
      </div>

      {/* 3. Marquee (Logos in Dark Background) */}
      <div className="w-full flex flex-col items-center gap-8 overflow-hidden relative pb-16">
        <p className="text-white/50 font-medium tracking-widest uppercase text-sm">Confiado por más de 100+ Clínicas y Profesionales</p>
        
        {/* Gradient Masks (Dark matching bg-brand-brown) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-brand-brown to-transparent z-10 pointer-events-none mt-12" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-brand-brown to-transparent z-10 pointer-events-none mt-12" />

        <div className="flex w-max animate-marquee opacity-50 hover:opacity-100 transition-opacity duration-500 cursor-default items-center">
          
          {/* Set 1 */}
          <div className="flex items-center justify-around gap-16 px-8 text-brand-beige">
            <span className="text-3xl font-black uppercase whitespace-nowrap">STRAUMANN</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> ORACLE</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">INVISALIGN</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">NOBEL BIOCARE</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> MORPHEUS</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">ZIMMER</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><b>{`//`}</b> monday</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">DENTSPLY SIRONA</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> segment</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">PLANMECA</span>
          </div>
          
          {/* Set 2 (Duplicate) */}
          <div className="flex items-center justify-around gap-16 px-8 text-brand-beige">
            <span className="text-3xl font-black uppercase whitespace-nowrap">STRAUMANN</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> ORACLE</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">INVISALIGN</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">NOBEL BIOCARE</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> MORPHEUS</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">ZIMMER</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><b>{`//`}</b> monday</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">DENTSPLY SIRONA</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap flex items-center gap-2"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> segment</span>
            <span className="text-3xl font-black uppercase whitespace-nowrap">PLANMECA</span>
          </div>
          
        </div>
      </div>

      {/* Tomography AI Section */}
      <section className="w-full relative pt-32 pb-8 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-brand-blue-light to-[#f8f7f5] z-10 rounded-t-[3rem] -mt-10">
        {/* Background Clouds/Glow effect */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue-base rounded-full blur-[140px] opacity-70"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue-base rounded-full blur-[100px] opacity-70"></div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col items-center relative z-20 px-4 w-full">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-brand-dark mb-6 text-center leading-[1.05] tracking-tight drop-shadow-sm">
            Decisiones clínicas <br/>potenciadas por IA
          </h2>
          <p className="text-brand-dark/70 text-lg md:text-xl font-bold text-center max-w-2xl mb-10 leading-relaxed">
            Visualiza tomografías en 3D, detecta patologías automáticamente y mejora el diagnóstico de tus pacientes en segundos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto justify-center">
             <Link href="/login" className="bg-brand-brown hover:bg-brand-dark text-white px-8 py-4 rounded-full font-black transition-all shadow-xl hover:shadow-2xl shadow-brand-brown/20 text-center flex items-center justify-center">
               Probar gratis
             </Link>
             <Link href="#contacto" className="bg-white hover:bg-brand-beige/20 text-brand-dark border border-gray-200 px-8 py-4 rounded-full font-black transition-all shadow-lg flex items-center justify-center gap-3">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span> Agendar Demo
             </Link>
          </div>

          {/* Software Mockup */}
          <div className="w-full bg-white rounded-t-[2.5rem] border-t-[8px] border-x-[8px] border-brand-brown shadow-2xl overflow-hidden flex flex-col h-[500px] md:h-[750px] relative">
             {/* Mockup Header */}
             <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
               <div className="flex items-center gap-6">
                 <div className="flex gap-1.5">
                   <div className="w-3.5 h-3.5 rounded-full bg-[#ef4444]"></div>
                   <div className="w-3.5 h-3.5 rounded-full bg-[#eab308]"></div>
                   <div className="w-3.5 h-3.5 rounded-full bg-[#22c55e]"></div>
                 </div>
                 <div className="font-black text-brand-dark text-lg flex items-center gap-2">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-brown"><path d="M12 21v-3" /><path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" /></svg>
                   3D Dental Dashboard
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="text-sm font-bold text-gray-500 hidden sm:block">Dr. David Martin</div>
                 <div className="w-9 h-9 rounded-full bg-brand-brown text-brand-beige flex items-center justify-center font-black">DM</div>
               </div>
             </div>

             {/* Mockup Body */}
             <div className="flex flex-1 overflow-hidden bg-gray-50/50">
               {/* Sidebar */}
               <div className="w-64 border-r border-gray-100 bg-white p-5 hidden lg:flex flex-col gap-3 shrink-0">
                 <div className="p-3.5 rounded-2xl bg-brand-beige/30 text-brand-brown font-bold flex items-center gap-3">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                   Visor 3D DICOM
                 </div>
                 <div className="p-3.5 rounded-2xl text-gray-500 font-bold flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                   Reportes IA
                 </div>
                 <div className="p-3.5 rounded-2xl text-gray-500 font-bold flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                   Pacientes
                 </div>
                 
                 <div className="mt-8">
                    <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 px-3">Herramientas</div>
                    <div className="grid grid-cols-2 gap-3 px-1">
                      <div className="aspect-square rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:bg-gray-100 cursor-pointer border border-gray-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <span className="text-[11px] font-bold">Zoom</span>
                      </div>
                      <div className="aspect-square rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:bg-gray-100 cursor-pointer border border-gray-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12h4l2-9 4 18 2-9h6"/></svg>
                        <span className="text-[11px] font-bold">Medir</span>
                      </div>
                      <div className="aspect-square rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-1.5 text-gray-500 hover:bg-gray-100 cursor-pointer border border-gray-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        <span className="text-[11px] font-bold">Cortes</span>
                      </div>
                      <div className="aspect-square rounded-2xl bg-brand-beige/30 flex flex-col items-center justify-center gap-1.5 text-brand-brown cursor-pointer border border-brand-brown/30">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                        <span className="text-[11px] font-bold">Render 3D</span>
                      </div>
                    </div>
                 </div>
               </div>

               {/* Main View Area */}
               <div className="flex-1 flex flex-col relative p-4 lg:p-6 gap-4">
                 
                 {/* Top Status Bar */}
                 <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-[1.25rem] shadow-sm border border-gray-100">
                   <div>
                     <div className="font-black text-brand-dark text-sm sm:text-base">Paciente: Olivia Gómez</div>
                     <div className="text-xs text-gray-500 font-bold">CBCT Maxilar Inferior • 14 May 2026</div>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="bg-[#ecfdf5] text-[#059669] px-4 py-2 rounded-xl text-[11px] font-black flex items-center gap-1.5 border border-[#a7f3d0]">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                       IA Analizado
                     </span>
                     <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-xl text-sm font-black transition-colors hidden sm:block">Exportar</button>
                   </div>
                 </div>

                 {/* Tomography Image Area */}
                 <div className="flex-1 bg-brand-dark rounded-3xl overflow-hidden relative shadow-inner group">
                   
                   {/* Background placeholder for tomography */}
                   <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale pointer-events-none" alt="Tomography BG" />
                   
                   {/* Fake 3D jaw render (overlay) */}
                   <div className="absolute inset-0 flex items-center justify-center">
                     <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop" className="w-[120%] sm:w-[90%] lg:w-[70%] opacity-80 mix-blend-lighten grayscale contrast-150 drop-shadow-[0_0_40px_rgba(59,130,246,0.3)]" alt="3D Scan" style={{ filter: "hue-rotate(200deg) brightness(1.2)"}} />
                   </div>

                   {/* AI Detections Overlays */}
                   <div className="absolute top-[25%] left-[10%] sm:left-[35%] w-14 h-14 border-[3px] border-[#ef4444] rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                   <div className="absolute top-[23%] left-[13%] sm:left-[38%] bg-[#ef4444] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap z-10 flex items-center gap-1">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                     Pérdida Ósea 85%
                   </div>

                   <div className="absolute top-[55%] right-[10%] sm:right-[30%] w-12 h-12 border-[3px] border-[#eab308] rounded-full animate-[pulse_3s_ease-in-out_infinite] shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                   <div className="absolute top-[52%] right-[14%] sm:right-[34%] bg-[#eab308] text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap z-10">
                     Canal Mandibular
                   </div>

                   {/* Interface Controls */}
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-gray-900/90 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 shadow-2xl">
                     <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/></svg></button>
                     <div className="px-5 text-white text-sm font-mono font-black tracking-widest">SLICE 142<span className="text-gray-500">/350</span></div>
                     <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/></svg></button>
                   </div>
                   
                   {/* Measurement details */}
                   <div className="absolute right-5 top-5 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-white hidden md:block shadow-2xl w-56">
                     <div className="text-[11px] font-black uppercase text-gray-400 mb-3 tracking-wider flex items-center justify-between">
                       Densidad Ósea
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                     </div>
                     <div className="flex flex-col gap-3">
                       <div className="flex justify-between items-center gap-4 text-xs font-mono font-bold"><span>D1 (HU &gt; 1250)</span> <span className="text-[#34d399] bg-[#34d399]/10 px-2 py-0.5 rounded">Normal</span></div>
                       <div className="flex justify-between items-center gap-4 text-xs font-mono font-bold"><span>D2 (850 - 1250)</span> <span className="text-[#34d399] bg-[#34d399]/10 px-2 py-0.5 rounded">Normal</span></div>
                       <div className="flex justify-between items-center gap-4 text-xs font-mono font-bold"><span>D3 (350 - 850)</span> <span className="text-[#fbbf24] bg-[#fbbf24]/10 px-2 py-0.5 rounded">Revisar</span></div>
                     </div>
                     <div className="mt-4 pt-3 border-t border-white/10">
                       <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                         <div className="w-[85%] h-full bg-gradient-to-r from-[#34d399] to-[#fbbf24]"></div>
                       </div>
                       <div className="text-[10px] text-gray-500 font-bold mt-1.5 text-right">Calidad General 85%</div>
                     </div>
                   </div>

                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. Smart Tools Section (Cards + Phone) */}
      <section className="w-full bg-[#f8f7f5] px-4 sm:px-12 lg:px-20 pt-12 pb-24 font-sans rounded-t-[3rem] relative z-20 -mt-16">
        <div className="max-w-7xl mx-auto mb-32">
          {/* Heading */}
          <div className="text-center mb-16 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-brown leading-[1.1] max-w-2xl">
              Herramientas inteligentes para crecimiento.
            </h2>
          </div>
          
          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-[1400px] mx-auto w-full">
            
            {/* Left Column (2 Cards) */}
            <div className="lg:col-span-4 flex flex-col gap-8 justify-between h-full">
               
               {/* Card 1 */}
               <div className="bg-white shadow-xl shadow-brand-brown/5 p-8 rounded-[2rem] border border-brand-brown/10 flex flex-col justify-center flex-1 min-h-[280px]">
                 <div className="w-14 h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-brown/30">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                 </div>
                 <h3 className="text-3xl font-black text-brand-dark mb-4 leading-tight">Gestión <br/>Multi-Clínica</h3>
                 <p className="text-brand-dark/60 font-bold text-sm leading-relaxed">Administra todas tus sucursales y estudios en un único panel inteligente.</p>
               </div>

               {/* Card 2 */}
               <div className="bg-brand-beige p-8 rounded-[2rem] border border-brand-beige/50 relative overflow-hidden flex flex-col justify-start flex-1 min-h-[300px]">
                 <h3 className="text-3xl font-black text-brand-dark mb-4 leading-tight relative z-10">Portal de <br/>Pacientes</h3>
                 <p className="text-brand-dark/60 font-bold text-sm relative z-10 max-w-[65%]">Acceso en tiempo real a los resultados desde cualquier lugar.</p>
                 <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full object-cover border-[10px] border-[#f8f7f5]" alt="Patient" />
               </div>

            </div>

            {/* Center Column (Mobile App Showcase) */}
            <div className="lg:col-span-4 flex justify-center items-center py-10 lg:py-0 w-full h-[720px] relative">
               
               {/* Main Phone Mockup */}
               <div className="relative w-[320px] h-[650px] bg-[#E8E6DD] rounded-[3.5rem] p-[14px] shadow-2xl shadow-brand-brown/30 border-[6px] border-white transform transition-transform duration-500 hover:-translate-y-6 z-20">
                 <div className="w-full h-full bg-[#F4F1EA] rounded-[2.8rem] relative overflow-hidden border border-black/5 flex flex-col items-center pt-24">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1c1c1c] rounded-b-3xl"></div>
                    
                    <div className="w-24 h-24 bg-[#2C6B6B] rounded-full flex items-center justify-center shadow-xl shadow-[#2C6B6B]/40 mb-8">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                    </div>
                    
                    <h3 className="text-3xl font-black text-[#385B7A] mb-3 uppercase tracking-wider">KIT VALIDADO</h3>
                    <p className="text-center text-[#7C90A0] text-[15px] px-8 mb-12 font-bold leading-relaxed">Autenticidad comprobada por GM Kit Studio.</p>
                    
                    <div className="bg-white w-[85%] rounded-[1.5rem] p-7 shadow-lg flex flex-col gap-5">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-gray-400 font-bold text-sm">Feedback</span>
                        <span className="text-[#2C4059] font-black text-sm">¡Calidad 10/10!</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                        <span className="text-gray-400 font-bold text-sm">Doctor/a</span>
                        <span className="text-[#2C4059] font-black text-sm">Dr. Wagner</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-bold text-sm">Valoración</span>
                        <div className="flex text-[#6C7D8F] text-sm">★★★★★</div>
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-8 w-[65%] h-24 bg-[#4A6782] rounded-t-full"></div>
                 </div>
               </div>

            </div>

            {/* Right Column (2 Cards) */}
            <div className="lg:col-span-4 flex flex-col gap-8 justify-between h-full">
               
               {/* Card 3 */}
               <div className="bg-white shadow-xl shadow-brand-brown/5 p-8 rounded-[2rem] border border-brand-brown/10 relative overflow-hidden flex flex-col justify-start flex-1 min-h-[300px]">
                 <h3 className="text-3xl font-black text-brand-dark mb-4 leading-tight relative z-10">Reportes <br/>Inteligentes</h3>
                 <p className="text-brand-dark/60 font-bold text-sm relative z-10 max-w-[65%]">Métricas precisas y envíos automatizados a especialistas.</p>
                 <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=400" className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full object-cover border-[10px] border-[#f8f7f5]" alt="Doctor" />
               </div>

               {/* Card 4 (Brown Button Card) */}
               <div className="bg-brand-brown shadow-2xl shadow-brand-brown/20 p-8 rounded-[2rem] relative overflow-hidden flex flex-col justify-between flex-1 min-h-[300px]">
                 <div className="relative z-10">
                   <h3 className="text-3xl font-black text-brand-beige mb-4 leading-tight">Impulsa tu <br/>Cuenta ahora</h3>
                   <p className="text-brand-beige/70 font-bold text-sm max-w-[80%] leading-relaxed">Descarga la app y experimenta el control total de tus finanzas.</p>
                 </div>
                 <div className="mt-8 relative z-10">
                   <button className="bg-brand-beige text-brand-brown font-black px-6 py-3.5 rounded-xl hover:bg-white transition-colors w-max shadow-lg">
                     Descargar App
                   </button>
                 </div>
                 <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400" className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full object-cover border-[10px] border-[#8a6b4e] opacity-90" alt="Staff" />
               </div>

            </div>
          </div>
        </div>

        {/* 5. Bento Grid Features */}
        <div className="max-w-6xl mx-auto flex flex-col gap-24 mt-20">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 relative h-[550px] rounded-[2.5rem] overflow-hidden shadow-md bg-brand-brown/5">
              <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000" alt="Profesional" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 bg-white p-4 sm:p-6 rounded-3xl shadow-2xl flex flex-col gap-3 sm:gap-4 w-64 sm:w-72">
                <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                  <span>Balance</span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">Oct - Feb ▼</span>
                </div>
                <div className="text-3xl font-bold text-brand-brown">
                  <span className="text-lg mr-1">$</span>15,560.00
                </div>
                <div className="h-20 w-full mt-2 relative">
                  <svg viewBox="0 0 100 40" className="w-full h-full stroke-brand-brown fill-none" strokeWidth="1.5">
                    <path d="M0,35 Q10,25 20,30 T40,20 T60,25 T80,10 T100,15" />
                    <circle cx="60" cy="25" r="3" className="fill-brand-brown stroke-white stroke-2" />
                  </svg>
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-brand-brown text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">1500</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-brand-brown rounded-[2.5rem] p-10 text-white relative shadow-md flex-1 flex flex-col justify-center">
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                </div>
                <div className="w-14 h-14 rounded-full border-2 border-brand-blue/30 flex items-center justify-center mb-8 bg-brand-blue/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9DCE8" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3 className="text-[3.5rem] leading-none font-bold text-brand-blue mb-4">50K</h3>
                <p className="text-brand-beige/80 font-medium text-lg max-w-[200px]">Contributions in<br/>the last year</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-8 text-brand-dark bg-gray-50 rounded-[2.5rem] shadow-sm">
                <h3 className="text-5xl font-bold mb-3">70,000+</h3>
                <p className="text-xl opacity-70 font-medium">Clients</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center mt-12 mb-4">
            <span className="text-brand-dark/50 uppercase tracking-widest font-bold mb-4 text-sm">GROW FINANCIALLY</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-dark max-w-2xl leading-tight">
              Unlock smart tools designed for financial growth.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-blue/10 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden h-[340px] shadow-sm border border-brand-blue/20">
              <h3 className="text-3xl font-bold text-brand-dark mb-4 max-w-[200px] leading-tight">Subscribe to<br/>our Newsletter</h3>
              <p className="text-brand-dark/60 text-sm mb-6 flex-1 max-w-[220px] font-medium leading-relaxed">
                Get insights, offers, and money-saving advice straight to your inbox.
              </p>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400" className="absolute -bottom-16 -right-10 w-52 h-52 rounded-full object-cover border-[6px] border-white" alt="Newsletter" />
            </div>

            <div className="bg-gray-50 rounded-[2.5rem] p-8 flex flex-col relative h-[340px] shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-brand-brown rounded-xl flex items-center justify-center text-white mb-8 shadow-md">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 className="text-3xl font-bold text-brand-dark mb-4 leading-tight">Multi-Account<br/>Management</h3>
              <p className="text-brand-dark/60 text-sm font-medium leading-relaxed">
                Seamlessly control all your finances and accounts in one unified dashboard.
              </p>
            </div>

            <div className="bg-brand-brown rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden h-[340px] text-white shadow-md">
              <h3 className="text-3xl font-bold text-white mb-4 max-w-[200px] leading-tight">Boost your<br/>Account now</h3>
              <p className="text-white/70 text-xs mb-6 flex-1 max-w-[220px] font-medium leading-relaxed">
                Download the app now and experience full control of your finances.
              </p>
              <div className="mt-auto relative z-10">
                <button className="bg-brand-blue text-brand-brown px-5 py-2.5 rounded-xl text-sm font-bold w-max shadow-md hover:bg-white transition-colors">
                  Download App
                </button>
              </div>
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400" className="absolute -bottom-8 -right-8 w-44 h-44 rounded-full object-cover border-[6px] border-brand-brown opacity-90" alt="Boost Account" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Steps (Beige Background) */}
      <section className="w-full bg-brand-beige px-4 sm:px-12 lg:px-20 py-24 font-sans rounded-[3rem] -mt-8 relative z-30">
         <div className="max-w-6xl mx-auto flex flex-col items-center">
           <h2 className="text-4xl md:text-5xl font-bold text-brand-brown mb-16 text-center">¡Ten tu diagnóstico en 1 día!</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
             {[1,2,3,4].map((step, i) => (
               <div key={i} className="flex flex-col items-center text-center bg-white rounded-[2rem] p-8 wave-fill wave-fill-text-hover shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                 <div className="step-circle w-14 h-14 rounded-full bg-brand-brown text-white flex items-center justify-center font-bold text-2xl mb-6 shadow-md transition-colors duration-500">{step}</div>
                 <h3 className="font-bold text-brand-brown text-xl mb-3 transition-colors duration-500">Paso {step}</h3>
                 <p className="text-brand-brown/80 text-sm font-medium transition-colors duration-500 relative z-10">Descripción del paso para tu estudio dental 3D de forma rápida y sencilla.</p>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* 5. Cards (White Background) */}
      <section className="w-full bg-white px-4 sm:px-12 lg:px-20 py-24 font-sans rounded-[3rem] -mt-8 relative z-40">
        <div className="max-w-6xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-brand-beige wave-fill wave-fill-text-hover rounded-[2.5rem] p-10 flex flex-col justify-center min-h-[300px] shadow-sm cursor-pointer hover:shadow-xl transition-shadow group">
               <h3 className="text-5xl font-bold text-brand-brown mb-4 leading-tight drop-shadow-sm relative z-10 transition-colors duration-500">¡Juntos<br/>es mejor!</h3>
            </div>
            <div className="flex-1 bg-white wave-fill wave-fill-text-hover border border-gray-100 shadow-xl shadow-brand-blue/20 rounded-[2.5rem] p-10 flex flex-col justify-center cursor-pointer hover:shadow-2xl transition-shadow group">
               <h3 className="text-3xl font-bold text-brand-brown mb-2 relative z-10 transition-colors duration-500">Ecosistema <span className="text-brand-blue drop-shadow-sm transition-colors duration-500">DICOM</span></h3>
               <p className="text-xl font-medium text-brand-brown/80 mb-6 relative z-10 transition-colors duration-500">Integración directa con tu software</p>
               <p className="text-brand-brown/60 text-sm font-medium leading-relaxed relative z-10 transition-colors duration-500">Vincula nuestra API con tu sistema de gestión odontológica para recibir las tomografías instantáneamente de forma segura y automatizada.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Blue Grid (Blue Background) */}
      <section className="w-full bg-brand-blue px-4 sm:px-12 lg:px-20 py-24 font-sans rounded-[3rem] -mt-8 relative z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-5/12 bg-white rounded-[2.5rem] p-10 flex flex-col justify-end min-h-[400px] relative overflow-hidden shadow-sm">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="Tech" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
            <h3 className="text-4xl font-bold text-brand-brown relative z-10 leading-tight">Transformación<br/>Digital Dental</h3>
          </div>
          <div className="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Historia Clínica", desc: "Almacenamiento seguro de todos tus estudios.", icon: "📋" },
              { title: "Teleconsulta", desc: "Seguimiento online con nuestros especialistas.", icon: "🎥" },
              { title: "App Móvil", desc: "Visualiza tus escaneos desde cualquier lugar.", icon: "📱" },
              { title: "IA Integrada", desc: "Análisis inteligente para mayor precisión.", icon: "🤖" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] p-6 flex flex-col h-[190px] shadow-sm hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-brand-beige flex items-center justify-center text-xl mb-auto shadow-sm">{item.icon}</div>
                <h4 className="font-bold text-brand-brown text-lg mb-1">{item.title}</h4>
                <p className="text-brand-brown/70 text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Stacked Section (White Background) */}
      <section className="w-full bg-white px-4 sm:px-12 lg:px-20 py-24 font-sans rounded-[3rem] -mt-8 relative z-60">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-5/12 flex flex-col gap-4">
             {[
               { title: "Certificación", desc: "Cumplimos con normativas internacionales de bioseguridad." },
               { title: "Seguridad", desc: "Tus datos están encriptados y totalmente protegidos." },
               { title: "Calidad", desc: "Control de calidad riguroso en cada estudio." },
             ].map((item, i) => (
               <div key={i} className="bg-brand-beige rounded-[2rem] p-6 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                 <div className="w-10 h-10 rounded-full bg-brand-brown text-white flex items-center justify-center shrink-0">✓</div>
                 <div>
                   <h4 className="font-bold text-brand-brown text-lg mb-1">{item.title}</h4>
                   <p className="text-brand-brown/70 text-sm leading-relaxed font-medium">{item.desc}</p>
                 </div>
               </div>
             ))}
          </div>
          <div className="w-full md:w-7/12 bg-brand-blue/30 rounded-[2.5rem] relative overflow-hidden min-h-[350px] shadow-sm flex justify-center items-center">
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800" className="absolute w-[60%] h-[120%] object-cover rounded-[3rem] border-8 border-white shadow-2xl rotate-12 translate-x-12" alt="App" />
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800" className="absolute w-[60%] h-[120%] object-cover rounded-[3rem] border-8 border-white shadow-2xl -rotate-6 -translate-x-12" alt="App" />
          </div>
        </div>
      </section>

      {/* 8. FAQ (Beige Background) */}
      <section className="w-full bg-brand-beige px-4 sm:px-12 lg:px-20 py-24 font-sans rounded-[3rem] -mt-8 relative z-[70]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-brown mb-12 text-center">Preguntas y respuestas:</h2>
          <div className="w-full flex flex-col gap-4">
            {[
              { q: "¿Cómo solicitar un turno para tomografía?", a: "Puedes solicitar tu turno de forma rápida a través de nuestro WhatsApp, llamada telefónica o directamente desde nuestra plataforma online." },
              { q: "¿Qué preparación necesito antes del estudio?", a: "La mayoría de nuestros estudios no requieren preparación previa. En caso de necesitarlo, te indicaremos si debes quitarte joyas u objetos metálicos antes del escáner." },
              { q: "¿En cuánto tiempo entregan los resultados 3D?", a: "Tus resultados estarán listos y subidos de manera segura a nuestra nube en menos de 24 horas." },
              { q: "¿Aceptan obras sociales o prepagas?", a: "Trabajamos con una amplia red de obras sociales y prepagas. Contáctanos con el nombre de la tuya para verificar cobertura." },
              { q: "¿Es doloroso el procedimiento del escáner intraoral?", a: "En lo absoluto. Nuestros escáneres son 100% no invasivos, rápidos y completamente indoloros para el paciente." },
              { q: "¿Cómo envían los resultados a mi odontólogo?", a: "Compartimos los archivos digitales (DICOM/STL) directamente con tu odontólogo a través de nuestro portal seguro en la nube." }
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group [&_summary::-webkit-details-marker]:hidden">
                <summary className="font-bold text-brand-brown cursor-pointer flex justify-between items-center list-none outline-none">
                  <span className="pr-4">{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-brand-blue text-brand-brown flex items-center justify-center font-black shrink-0 transition-transform group-open:rotate-45 group-hover:bg-brand-brown group-hover:text-brand-beige">
                    +
                  </span>
                </summary>
                <div className="text-brand-brown/70 font-medium pt-4 pb-2 leading-relaxed animate-in fade-in slide-in-from-top-4 duration-300">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Contact / Map Section */}
      <section className="w-full relative min-h-[600px] flex items-center justify-center -mt-8 z-[75] rounded-t-[3rem] overflow-hidden bg-brand-beige">
        {/* Map Background */}
        <div className="absolute inset-0">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x94225c5a75a7c933%3A0xb3cf5b4df2c29bc9!2sRondeau%20827%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses-419!2sar!4v1715694285435!5m2!1ses-419!2sar" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-300"
          ></iframe>
        </div>
        
        {/* Floating Card */}
        <div className="relative z-10 w-full max-w-5xl mx-4 my-24 bg-[#F2EDE4] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/50">
           
           {/* Left Column (Form) */}
           <div className="w-full md:w-3/5 p-10 lg:p-14">
             <h3 className="text-2xl font-black text-[#435C70] mb-8 uppercase tracking-widest">Enviar Mensaje</h3>
             <form className="flex flex-col gap-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Nombre Completo</label>
                   <input type="text" placeholder="Dr. Juan Pérez" className="bg-transparent border-b border-gray-300 pb-2 text-[#435C70] placeholder-gray-400 font-medium focus:outline-none focus:border-[#435C70] transition-colors" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Clínica / Empresa</label>
                   <input type="text" placeholder="Centro Odontológico" className="bg-transparent border-b border-gray-300 pb-2 text-[#435C70] placeholder-gray-400 font-medium focus:outline-none focus:border-[#435C70] transition-colors" />
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Teléfono</label>
                   <input type="text" placeholder="+54 9 381..." className="bg-transparent border-b border-gray-300 pb-2 text-[#435C70] placeholder-gray-400 font-medium focus:outline-none focus:border-[#435C70] transition-colors" />
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Presupuesto / Info</label>
                   <input type="text" placeholder="Asociar mi clínica" className="bg-transparent border-b border-gray-300 pb-2 text-[#435C70] placeholder-gray-400 font-medium focus:outline-none focus:border-[#435C70] transition-colors" />
                 </div>
               </div>

               <div className="flex flex-col gap-2 relative mt-4">
                 <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Mensaje</label>
                 <textarea placeholder="Hola, me gustaría cotizar..." className="bg-transparent border-b border-gray-300 pb-2 text-[#435C70] placeholder-gray-400 font-medium focus:outline-none focus:border-[#435C70] transition-colors resize-none h-12"></textarea>
                 
                 <button type="button" className="absolute bottom-0 right-0 w-12 h-12 bg-[#6B859E] rounded-full flex items-center justify-center text-white hover:bg-[#435C70] transition-colors shadow-lg">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                 </button>
               </div>
             </form>
           </div>
           
           {/* Right Column (Info) */}
           <div className="w-full md:w-2/5 bg-[#435C70] p-10 lg:p-14 text-white flex flex-col justify-between">
             <div>
               <h3 className="text-xl font-bold mb-10 tracking-widest uppercase">Información de Contacto</h3>
               
               <div className="flex flex-col gap-8">
                 <div className="flex items-start gap-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 opacity-70"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                   <div>
                     <p className="font-bold text-sm">JOSE RONDEAU 827</p>
                     <p className="text-xs opacity-70 mt-1">San Miguel de Tucumán, Argentina</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                   <p className="font-bold text-sm">+54 9 381 500-0000</p>
                 </div>

                 <div className="flex items-center gap-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-70"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                   <p className="font-bold text-sm">contacto@3ddental.com.ar</p>
                 </div>
               </div>
             </div>

             {/* Social Icons */}
             <div className="flex gap-4 mt-12">
               <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#435C70] transition-colors">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
               </a>
               <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#435C70] transition-colors">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               </a>
             </div>
           </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-brown py-12 text-brand-beige/70 text-center flex flex-col items-center z-[80] relative -mt-8 rounded-t-[3rem]">
        <div className="flex gap-8 mb-8 text-sm font-bold tracking-wide">
          <Link href="/" className="hover:text-brand-blue transition-colors">Inicio</Link>
          <Link href="#servicios" className="hover:text-brand-blue transition-colors">Servicios</Link>
          <Link href="#contacto" className="hover:text-brand-blue transition-colors">Contacto</Link>
        </div>
        <div className="w-16 h-[1px] bg-brand-beige/20 mb-6" />
        <p className="text-xs tracking-wider">COPYRIGHT © 2024 CENTRO DENTAL 3D. TODOS LOS DERECHOS RESERVADOS.</p>
      </footer>
    </div>
  );
}
