'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Focus trap and ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Evitar scroll de fondo
      
      // Auto-focus first focusable element for a11y
      setTimeout(() => {
        const focusableElements = sheetRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }, 100);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center sm:p-4 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bottom-sheet-title"
    >
      {/* Overlay clickeable para cerrar */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={onClose} 
        aria-hidden="true"
      />

      {/* Contenedor principal (Bottom Sheet en móvil, Modal en desktop) */}
      <div 
        ref={sheetRef}
        className={`
          relative z-10 w-full sm:max-w-lg bg-card text-card-foreground border border-border shadow-2xl
          rounded-t-2xl sm:rounded-2xl flex flex-col
          transform transition-transform duration-300 ease-out
          animate-in slide-in-from-bottom sm:slide-in-from-bottom-8 sm:zoom-in-95
        `}
      >
        {/* Barra de arrastre visual para móvil */}
        <div className="w-full flex justify-center py-3 sm:hidden" aria-hidden="true">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-b border-border/50">
          <h2 id="bottom-sheet-title" className="text-xl font-bold font-heading">
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
