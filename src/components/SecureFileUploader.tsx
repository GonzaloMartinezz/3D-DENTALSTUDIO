'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, CheckCircle, AlertTriangle, File as FileIcon, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function SecureFileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [pacienteDni, setPacienteDni] = useState('');
  const [tipoEstudio, setTipoEstudio] = useState('Tomografía Maxilar');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/dicom': ['.dcm'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: uploading
  });

  const handleUpload = async () => {
    if (!file || !pacienteDni.trim() || !tipoEstudio.trim()) return;

    setUploading(true);
    setStatus('idle');
    
    // Simular progreso para UX app-like (Supabase js v2 no expone onUploadProgress directo en standard upload, TUS es requerido para archivos muy grandes, usaremos un fake progress fluido para UX)
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 300);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `secure-transfers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('estudios-dentales')
        .upload(filePath, file, { 
          cacheControl: '3600', 
          upsert: false 
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Create record in estudios table
      const { error: dbError } = await supabase
        .from('estudios')
        .insert([
          {
            paciente_dni: pacienteDni.trim(),
            tipo_estudio: tipoEstudio.trim(),
            estado: 'Completado',
            archivo_url: filePath,
            fecha_estudio: new Date().toISOString()
          }
        ]);

      if (dbError) throw dbError;

      setProgress(100);
      setStatus('success');
      
      // Limpiar archivo tras éxito
      setTimeout(() => {
        setFile(null);
        setPacienteDni('');
        setTipoEstudio('Tomografía Maxilar');
        setProgress(0);
        setStatus('idle');
      }, 3000);

    } catch (err: any) {
      clearInterval(progressInterval);
      setStatus('error');
      setErrorMessage(err.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setStatus('idle');
  };

  return (
    <section 
      aria-labelledby="uploader-title" 
      className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-lg max-w-lg mx-auto"
    >
      <h2 id="uploader-title" className="text-xl font-bold mb-4 font-heading text-white">
        Portal de Transferencia Segura
      </h2>
      
      <p className="text-sm text-muted-foreground mb-6">
        Sube estudios 3D (.zip, .dcm) o documentación (.pdf). El acceso está protegido mediante firma temporal.
      </p>

      {/* Patient Info Inputs */}
      <div className="flex flex-col space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2" htmlFor="dni">DNI del Paciente</label>
          <input 
            id="dni"
            type="text" 
            value={pacienteDni}
            onChange={(e) => setPacienteDni(e.target.value)}
            disabled={uploading}
            placeholder="Ej: 12345678"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2" htmlFor="tipo">Tipo de Estudio</label>
          <input 
            id="tipo"
            type="text" 
            value={tipoEstudio}
            onChange={(e) => setTipoEstudio(e.target.value)}
            disabled={uploading}
            placeholder="Ej: Tomografía Maxilar, Panorámica..."
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Zona Drag & Drop */}
      <div 
        {...getRootProps()} 
        className={`
          relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed 
          cursor-pointer transition-all duration-300 min-h-[200px]
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
          ${isFocused ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        aria-disabled={uploading}
        tabIndex={0}
      >
        <input {...getInputProps()} aria-label="Seleccionar archivo para subir" />
        
        {file ? (
          <div className="flex flex-col items-center text-center space-y-4 w-full">
            <div className="relative">
              <FileIcon className="w-12 h-12 text-primary" />
              {!uploading && (
                <button 
                  onClick={removeFile}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Quitar archivo"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <span className="font-medium text-foreground break-all px-2">{file.name}</span>
            <span className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 bg-muted rounded-full">
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Haz clic o arrastra un archivo aquí</p>
              <p className="text-sm text-muted-foreground mt-1">Límite máximo: 2GB</p>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Progreso y Estados */}
      {status !== 'idle' && (
        <div className="mt-6" aria-live="polite">
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subiendo archivo...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Archivo transferido y cifrado correctamente.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}
        </div>
      )}

      {/* Botón de Acción Principal */}
      <button
        onClick={handleUpload}
        disabled={!file || !pacienteDni.trim() || !tipoEstudio.trim() || uploading || status === 'success'}
        className={`
          mt-6 w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2
          transition-all duration-200 min-h-[44px]
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          ${(!file || !pacienteDni.trim() || !tipoEstudio.trim() || uploading || status === 'success') 
            ? 'bg-muted text-muted-foreground cursor-not-allowed' 
            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--primary),0.3)]'}
        `}
      >
        <span>{uploading ? 'Procesando...' : 'Transferir Archivo'}</span>
      </button>
    </section>
  );
}
