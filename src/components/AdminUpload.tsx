'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AdminUpload() {
  const [dni, setDni] = useState('');
  const [tipoEstudio, setTipoEstudio] = useState('Tomografía 3D');
  const [file, setFile] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !dni) return alert('Por favor completa todos los campos.');

    setSubiendo(true);

    try {
      // 1. Subir el archivo .zip al Storage Bucket 'estudios-dentales'
      const fileExtension = file.name.split('.').pop();
      const filePath = `${dni}/${Date.now()}.${fileExtension}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('estudios-dentales')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (storageError) throw storageError;

      // 2. Insertar el registro en la base de datos PostgreSQL
      const { error: dbError } = await supabase
        .from('estudios')
        .insert([
          {
            paciente_dni: dni,
            tipo_estudio: tipoEstudio,
            estado: 'Completado',
            archivo_url: filePath // Guardamos la ruta relativa dentro del bucket
          }
        ]);

      if (dbError) throw dbError;

      alert('¡Estudio subido y registrado con éxito!');
      setFile(null);
      setDni('');
    } catch (error: any) {
      console.error(error);
      alert('Error en la carga: ' + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Cargar Nuevo Diagnóstico</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">DNI del Paciente</label>
          <input 
            type="text" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            className="w-full p-2 border rounded"
            placeholder="Ej. 44123456"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Tipo de Estudio</label>
          <select 
            value={tipoEstudio} 
            onChange={(e) => setTipoEstudio(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Tomografía 3D">Tomografía 3D (CBCT)</option>
            <option value="Radiografía Panorámica">Radiografía Panorámica</option>
          </select>
        </div>
        
        {/* Zona Drag & Drop / File Input */}
        <div className="border-2 border-dashed border-gray-300 p-6 rounded text-center cursor-pointer hover:bg-gray-50 relative">
          <input 
            type="file" 
            accept=".zip" 
            onChange={handleFileChange} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            id="file-upload" 
          />
          <div className="pointer-events-none">
            {file ? (
              <span className="text-green-600 font-medium">Archivo seleccionado: {file.name}</span>
            ) : (
              <span className="text-gray-500">Arrastra aquí el archivo .zip o haz clic para buscar</span>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={subiendo}
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {subiendo ? 'Subiendo archivo...' : 'Registrar y Subir Estudio'}
        </button>
      </form>
    </div>
  );
}
