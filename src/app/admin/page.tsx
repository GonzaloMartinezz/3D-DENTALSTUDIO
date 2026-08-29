import SecureFileUploader from '@/components/SecureFileUploader';
import AdminStudiesList from '@/components/AdminStudiesList';
import { Search, Bell, User } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex-1 min-h-screen bg-[#050505] text-white flex flex-col w-full">
      
      {/* Top Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#0a0806]">
        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar pacientes por nombre, DNI o estudio..."
            className="w-full bg-[#1a1512] border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]/50 focus:ring-1 focus:ring-[#d4af37]/50 transition-all"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 ml-4">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0a0806]"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-white leading-tight">Admin Principal</div>
              <div className="text-xs text-[#d4af37] font-medium">Conectado</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a1512] border border-white/10 flex items-center justify-center text-[#d4af37]">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto space-y-8">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-heading text-white">Panel de Administración</h1>
            <p className="mt-2 text-gray-400">
              Gestiona los estudios y diagnósticos por imágenes de los pacientes.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <SecureFileUploader />
            </div>
            
            <div className="lg:col-span-5 xl:col-span-4 bg-[#0a0806] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <h2 className="text-xl font-bold font-heading mb-6 text-white flex items-center gap-3">
                <span className="w-2 h-8 rounded-full bg-[#d4af37]"></span>
                Instrucciones
              </h2>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1512] text-[#d4af37] flex items-center justify-center font-bold flex-shrink-0 border border-white/5">1</div>
                  <p className="text-gray-400 text-sm leading-relaxed">Los archivos son encriptados y su acceso está protegido mediante firma temporal (URL firmada).</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1512] text-[#d4af37] flex items-center justify-center font-bold flex-shrink-0 border border-white/5">2</div>
                  <p className="text-gray-400 text-sm leading-relaxed">Formatos soportados: <strong>.zip, .dcm (DICOM) o .pdf</strong>.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1512] text-[#d4af37] flex items-center justify-center font-bold flex-shrink-0 border border-white/5">3</div>
                  <p className="text-gray-400 text-sm leading-relaxed">Asegúrese de que el estudio esté anonimizado o etiquetado correctamente por DNI.</p>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1512] text-[#d4af37] flex items-center justify-center font-bold flex-shrink-0 border border-white/5">4</div>
                  <p className="text-gray-400 text-sm leading-relaxed">La velocidad de transferencia será gestionada eficientemente por Supabase Storage (Direct Upload).</p>
                </li>
              </ul>
            </div>
          </div>
          
          <AdminStudiesList />
        </div>
      </main>
    </div>
  );
}
