import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/env';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const RUTAS_PRIVADAS = ['/paciente', '/admin', '/mfa'];

/** Refresca la sesión (cookies) y redirige a /login si falta sesión en rutas privadas. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  // getClaims() verifica la firma del JWT localmente y solo consulta a Supabase si hay que renovar el token
  const { data } = await supabase.auth.getClaims();
  const autenticado = !!data?.claims;
  const { pathname } = request.nextUrl;

  const esPrivada = RUTAS_PRIVADAS.some((ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`));
  if (!autenticado && esPrivada) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (autenticado && pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/paciente'; // /paciente deriva a /admin si corresponde
    url.search = '';
    return NextResponse.redirect(url);
  }

  return response;
}
