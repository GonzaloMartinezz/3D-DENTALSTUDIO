'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cerrarSesion } from '@/services/authService';

type Fase = 'cargando' | 'enrolar' | 'verificar';

export default function MfaPage() {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>('cargando');
  const [factorId, setFactorId] = useState('');
  const [qr, setQr] = useState('');
  const [secreto, setSecreto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.currentLevel === 'aal2') return router.replace('/admin');

      const { data: factores } = await supabase.auth.mfa.listFactors();
      const verificado = factores?.totp.find((f) => f.status === 'verified');
      if (verificado) {
        setFactorId(verificado.id);
        return setFase('verificar');
      }

      // Limpia intentos de enrolamiento abandonados antes de crear uno nuevo
      for (const f of factores?.all ?? []) {
        if (f.status === 'unverified') await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Autenticador' });
      if (error || !data) {
        setError('No se pudo iniciar la configuración: ' + (error?.message ?? ''));
        return setFase('enrolar');
      }
      setFactorId(data.id);
      setQr(data.totp.qr_code);
      setSecreto(data.totp.secret);
      setFase('enrolar');
    })();
  }, [router]);

  const confirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: codigo.trim() });
    setEnviando(false);
    if (error) return setError('Código incorrecto o vencido. Probá con el siguiente.');
    router.replace('/admin');
    router.refresh();
  };

  const salir = async () => {
    await cerrarSesion();
    router.replace('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3ec] px-4 py-8">
      <div className="w-full max-w-md bg-white text-brand-dark p-6 sm:p-8 rounded-3xl border border-brand-brown/10 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-brand-beige flex items-center justify-center text-brand-brown mb-6">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-brand-brown mb-2">Verificación en dos pasos</h1>

        {fase === 'cargando' && <p className="text-brand-dark/60">Cargando…</p>}

        {fase === 'enrolar' && (
          <p className="text-sm text-brand-dark/70 mb-4">
            El acceso de administración exige un segundo factor. Escaneá el código con Google Authenticator, Authy o similar e ingresá el código de 6 dígitos.
          </p>
        )}
        {fase === 'verificar' && <p className="text-sm text-brand-dark/70 mb-4">Ingresá el código de 6 dígitos de tu app autenticadora.</p>}

        {fase === 'enrolar' && qr && (
          <div className="mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Código QR para la app autenticadora" className="w-48 h-48 bg-white p-2 rounded-xl mx-auto border border-brand-brown/10" />
            <p className="text-xs text-brand-dark/50 text-center mt-2 break-all">¿No podés escanear? Clave manual: <span className="font-mono text-brand-dark">{secreto}</span></p>
          </div>
        )}

        {fase !== 'cargando' && (qr || fase === 'verificar') && (
          <form onSubmit={confirmar} className="space-y-4">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full bg-brand-beige/30 border border-brand-brown/20 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-brand-dark focus:outline-none focus:border-brand-brown"
            />
            <button type="submit" disabled={enviando || codigo.length !== 6} className="w-full bg-brand-brown text-white font-black py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60">
              {enviando ? 'Verificando…' : fase === 'enrolar' ? 'Activar y entrar' : 'Verificar'}
            </button>
          </form>
        )}

        {error && <p role="alert" className="mt-4 text-sm font-bold text-red-600">{error}</p>}

        <button onClick={salir} className="mt-6 text-xs text-brand-dark/50 hover:text-brand-brown underline">Cerrar sesión</button>
      </div>
    </div>
  );
}
