'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PatientDashboard from '@/components/PatientDashboard';
import { Loader2 } from 'lucide-react';

function DashboardContent() {
  const searchParams = useSearchParams();
  const dni = searchParams.get('dni');

  if (!dni) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">No se proporcionó un DNI válido.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <PatientDashboard UserDni={dni} />
    </div>
  );
}

export default function PacientePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
