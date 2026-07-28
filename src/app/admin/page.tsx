import AdminUpload from '@/components/AdminUpload';

export default function AdminPage() {
  return (
    <div className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-gray-600">
            Gestiona los estudios y diagnósticos por imágenes de los pacientes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <AdminUpload />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-bold mb-4">Instrucciones</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm">
              <li>El DNI ingresado debe coincidir exactamente con el DNI del paciente registrado.</li>
              <li>Asegúrese de comprimir la tomografía completa (Visor + DICOM) en formato <strong>.zip</strong>.</li>
              <li>La velocidad de subida dependerá de la conexión de la clínica y el tamaño del estudio (habitualmente entre 100MB y 500MB).</li>
              <li>Una vez que finalice, el estado pasará automáticamente a <strong>Completado</strong>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
