import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col bg-[#110b05] min-h-screen font-sans">
      
      {/* Top Navbar */}
      <header className="flex items-center justify-between p-6 relative z-20 max-w-7xl mx-auto w-full">
        {/* Left Space / Logo */}
        <div className="w-1/4 hidden md:flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" className="drop-shadow-sm">
             <path d="M12 21v-3" />
             <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
          </svg>
          <span className="text-[#d4af37] font-bold tracking-wider">3D DENTAL</span>
        </div>
        
        {/* Center Links */}
        <nav className="flex flex-1 justify-center gap-6 md:gap-10 text-white/80 font-medium text-sm md:text-base">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Inicio</Link>
          <Link href="#sobre-nosotros" className="hover:text-[#d4af37] transition-colors">Sobre Nosotros</Link>
          <Link href="#contacto" className="hover:text-[#d4af37] transition-colors">Contacto</Link>
        </nav>

        {/* Right Buttons */}
        <div className="w-auto md:w-1/4 flex justify-end gap-3 md:gap-4">
          <Link href="/login" className="hidden lg:inline-flex px-5 py-2 rounded-full border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10 transition-colors font-medium text-sm items-center">
            Iniciar Sesión
          </Link>
          <Link href="/login" className="px-5 py-2 rounded-full bg-[#d4af37] text-[#3a2515] font-bold hover:bg-[#b08d29] transition-colors text-sm flex items-center">
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pt-10 pb-24 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Diagnóstico Dental <br className="hidden md:block" />3D de Precisión
          </h1>
          <p className="text-gray-300 mb-10 max-w-md text-lg leading-relaxed mx-auto md:mx-0">
            Tecnología avanzada para tomografías y radiografías con la máxima calidad y seguridad.
          </p>
          <Link href="/login" className="px-8 py-3 rounded-full border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#110b05] transition-colors inline-block text-lg font-semibold shadow-lg">
            Sacar Turno
          </Link>
        </div>
        
        <div className="w-full md:w-1/2 mt-16 md:mt-0 relative flex justify-center md:justify-end">
           {/* Skull / Dental Image */}
           <img 
             src="https://images.unsplash.com/photo-1598934571731-97b4ec8b9813?q=80&w=800" 
             alt="3D Dental Scan" 
             className="w-[85%] md:w-[90%] object-contain drop-shadow-2xl brightness-90 contrast-125 sepia-[0.3]" 
             style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.8))' }} 
           />
        </div>
      </section>

      {/* New Services Component (1 to 5) */}
      <section className="w-full bg-[#110b05] px-4 sm:px-12 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto bg-[#A47148] rounded-[2.5rem] rounded-t-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
          
          {/* Subtle noise/texture overlay for premium feel */}
          <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#E4D5B7] text-center mb-16 tracking-widest uppercase drop-shadow-md">
              Servicios
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6 w-full">
              {[
                { id: "01", title: "TOMOGRAFÍAS CBCT", desc: "Alta resolución milimétrica para diagnósticos quirúrgicos exactos." },
                { id: "02", title: "RADIOGRAFÍA DIGITAL", desc: "Imágenes panorámicas con exposición mínima a la radiación." },
                { id: "03", title: "ESCÁNER INTRAORAL", desc: "Impresiones 3D precisas y rápidas sin usar pastas incómodas." },
                { id: "04", title: "PLANIFICACIÓN VIRTUAL", desc: "Simulación por computadora para ortodoncia e implantes." },
                { id: "05", title: "MODELOS 3D", desc: "Impresión de réplicas exactas de la estructura dental del paciente." }
              ].map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center relative group">
                  <div className="text-[6rem] font-black text-[#E4D5B7] opacity-25 leading-none mb-1 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-40">
                    {item.id}
                  </div>
                  <h3 className="text-[#E4D5B7] font-bold text-lg mb-3 tracking-wide drop-shadow-sm uppercase">{item.title}</h3>
                  <p className="text-[#E4D5B7]/90 text-sm leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section */}
      <section className="bg-[#fdfbf7] w-full py-24 px-6 sm:px-12 lg:px-20 text-[#3a2515]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000" alt="Clinic Interior" className="w-full h-[400px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3a2515]/20 to-transparent" />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">Sobre Nosotros</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              El Centro Dental 3D fue construido con la misión de ser pioneros en diagnósticos dentales precisos y seguros. Contamos con tecnología de vanguardia y un equipo de profesionales altamente capacitados.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Nuestro compromiso es brindar resultados confiables para que cada tratamiento sea planificado con la máxima excelencia.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestros Servicios Section */}
      <section className="bg-[#e9e0d1] w-full py-24 px-6 sm:px-12 lg:px-20 relative">
        <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-repeat" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")' }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3a2515] mb-16 text-center md:text-left tracking-tight">Nuestros Servicios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#3a2213] rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group hover:-translate-y-3 transition-transform duration-300 h-72">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a0f08]/90" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 border border-[#d4af37]/30 rounded-2xl mb-6 flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" className="drop-shadow-lg">
                    <path d="M12 21v-3" />
                    <path d="M8 20c-1.5-1-3-3-4-5.5-.8-2-.9-4-.8-6C3.5 5 6 3 8.5 3c2.5 0 3.5 2.5 3.5 2.5S13 3 15.5 3 20.5 5 20.8 8.5c.1 2 0 4-.8 6-1 2.5-2.5 4.5-4 5.5" />
                  </svg>
                </div>
                <h3 className="text-[#d4af37] font-bold text-xl drop-shadow-md tracking-wide">Tomografías<br/>CBCT 3D</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#3a2213] rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group hover:-translate-y-3 transition-transform duration-300 h-72">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a0f08]/90" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 border border-[#d4af37]/30 rounded-2xl mb-6 flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" className="drop-shadow-lg">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <path d="M8.5 10a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0"/>
                  </svg>
                </div>
                <h3 className="text-[#d4af37] font-bold text-xl drop-shadow-md tracking-wide">Radiografías<br/>Digitales</h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#3a2213] rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group hover:-translate-y-3 transition-transform duration-300 h-72">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a0f08]/90" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 border border-[#d4af37]/30 rounded-2xl mb-6 flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5" className="drop-shadow-lg">
                     <path d="M4 14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z"/>
                     <path d="M6 12v-2a6 6 0 0 1 12 0v2"/>
                  </svg>
                </div>
                <h3 className="text-[#d4af37] font-bold text-xl drop-shadow-md tracking-wide">Ortodoncia<br/>Virtual</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ubicaciones y Horarios */}
      <section className="bg-[#fdfbf7] w-full py-24 px-6 sm:px-12 lg:px-20 text-[#3a2515]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
             <h2 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight text-center md:text-left">Ubicaciones y Horarios</h2>
             <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
               <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000" alt="Map" className="w-full h-[350px] object-cover grayscale sepia-[0.3] contrast-125 hover:grayscale-0 transition-all duration-700" />
             </div>
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-12">
             
             <div className="flex gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="bg-[#3a2515]/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a2515" strokeWidth="2">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                   <circle cx="12" cy="10" r="3" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-2xl font-bold mb-2">Downtown</h3>
                 <p className="text-gray-500 mb-5">494 Dowslem Cksritanta, 134</p>
                 <div className="text-sm font-semibold space-y-2 text-[#3a2515]">
                   <p className="flex justify-between border-b border-gray-100 pb-2"><span className="opacity-70">Lunes - Viernes:</span> <span>8:00 - 20:00</span></p>
                   <p className="flex justify-between pt-1"><span className="opacity-70">Sábado:</span> <span>9:00 - 14:00</span></p>
                 </div>
               </div>
             </div>

             <div className="flex gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="bg-[#3a2515]/10 w-14 h-14 rounded-full flex items-center justify-center shrink-0">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a2515" strokeWidth="2">
                   <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                   <circle cx="12" cy="10" r="3" />
                 </svg>
               </div>
               <div>
                 <h3 className="text-2xl font-bold mb-2">Suburban</h3>
                 <p className="text-gray-500 mb-5">142 San Larcantso, Subburban</p>
                 <div className="text-sm font-semibold space-y-2 text-[#3a2515]">
                   <p className="flex justify-between border-b border-gray-100 pb-2"><span className="opacity-70">Lunes - Viernes:</span> <span>9:00 - 20:00</span></p>
                   <p className="flex justify-between pt-1"><span className="opacity-70">Sábado:</span> <span>8:00 - 14:00</span></p>
                 </div>
               </div>
             </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f1611] py-12 text-[#d4af37]/70 text-center flex flex-col items-center">
        <div className="flex gap-8 mb-8 text-sm font-medium tracking-wide">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Inicio</Link>
          <Link href="/sobre-nosotros" className="hover:text-[#d4af37] transition-colors">Sobre Nosotros</Link>
          <Link href="/contacto" className="hover:text-[#d4af37] transition-colors">Contacto</Link>
        </div>
        <div className="w-16 h-[1px] bg-[#d4af37]/20 mb-6" />
        <p className="text-xs tracking-wider">COPYRIGHT © 2024 CENTRO DENTAL 3D. TODOS LOS DERECHOS RESERVADOS.</p>
      </footer>
    </div>
  );
}
