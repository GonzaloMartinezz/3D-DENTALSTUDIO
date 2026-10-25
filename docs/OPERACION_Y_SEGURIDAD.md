# Operación y seguridad — Portal 3D Dental Studio

## Arquitectura (y por qué)

| Pieza | Elección | Motivo |
|---|---|---|
| App | Next.js (App Router) en Vercel | Páginas renderizadas en el servidor, sin JavaScript pesado para el paciente |
| Auth + DB + archivos | Supabase (Postgres, Auth, Storage) | Un solo proveedor administrado, backups, RLS |
| Región | Elegir la más cercana a los pacientes (ej. `sa-east-1`) | Menor latencia de consultas y descargas |
| Archivos | Bucket **privado**, subida directa del navegador (TUS reanudable) | El archivo nunca pasa por el servidor de la app: sin límites de tamaño de Vercel y subida más rápida |
| Descarga | URL firmada de 60 s, directo desde el storage | El servidor no transporta GB; la descarga sale por la CDN de Supabase |

### Velocidad
- La home y los assets no ejecutan ninguna lógica de sesión (el `proxy` solo corre en `/paciente`, `/admin`, `/mfa`, `/login`).
- La sesión se valida con `getClaims()` (verificación local de la firma del JWT), sin ir a Supabase en cada página.
- Listados paginados y con búsqueda en el servidor; índices `pg_trgm` para búsqueda por nombre/DNI/tipo. Escala a decenas de miles de estudios.
- Subida con 3 archivos en paralelo y chunks de 6 MB.

## Seguridad implementada

**Autenticación**
- Sin registro público: solo la clínica crea cuentas. **Desactivar "Allow new users to sign up" en Supabase → Authentication → Providers → Email.**
- El paciente debe cambiar la contraseña temporal en su primer ingreso (mínimo 10 caracteres).
- Los administradores **requieren 2FA (TOTP)**. La base rechaza consultas de admin sin `aal2`, aunque roben la contraseña.
- Mensajes de login genéricos (no revelan si el DNI existe). Supabase Auth aplica límite de intentos por IP.

**Autorización (defensa en profundidad)**
1. El `proxy` bloquea rutas privadas sin sesión.
2. Cada página/API vuelve a verificar rol (y 2FA para admin).
3. **RLS en la base de datos y en Storage**: aunque hubiera un bug en la app, un paciente solo puede leer filas y archivos de *sus* estudios *publicados*.
4. La `service role key` solo existe en el servidor y solo la usan rutas que antes verificaron que quien llama es admin.

**Archivos**
- Bucket privado, sin URLs públicas. Descargas con URL firmada de 60 s.
- Ruta `paciente_id/estudio_id/uuid-nombre`; nombres sanitizados.
- Subida "todo o nada": si falla, se borran los archivos y el estudio a medias.

**Página**
- CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- `Cache-Control: no-store` en todo lo privado.

**Trazabilidad**
- `descargas`: quién descargó qué archivo y cuándo.
- `auditoria`: altas/bajas/cambios de estudios, archivos y perfiles, escrita por triggers (no se puede alterar desde la API). Consulta: `select * from auditoria order by creado_en desc;`

## Checklist de configuración en Supabase (una vez)
1. Ejecutar `0001` y `0002` en orden.
2. Desactivar sign-ups públicos.
3. Authentication → Policies: largo mínimo de contraseña ≥ 10; activar *Leaked password protection* si el plan lo permite.
4. Authentication → Multi-Factor: TOTP habilitado.
5. Crear el primer admin (ver final de `0001`), entrar y completar `/mfa`.
6. **Backups**: activar backups diarios / PITR (plan Pro). **Los backups de la base NO incluyen los archivos del Storage**: programar una copia periódica del bucket `estudios-dentales` (por ejemplo con `rclone` hacia otro proveedor, vía el endpoint S3 de Supabase Storage).
7. Variables en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (marcada como secreta, solo producción/preview del servidor).
8. Límite de tamaño de archivo: el plan Free de Supabase limita a 50 MB por archivo; para tomografías se necesita plan Pro (ajustar *Storage → Settings → Global file size limit* a 2 GB).

## Mantenimiento a largo plazo
- Actualizar dependencias mensualmente (`npm outdated`, `npm audit`) y probar con `npm run build`.
- Revisar `auditoria` y `descargas` ante cualquier sospecha.
- Admin que pierde el celular: `delete from auth.mfa_factors where user_id = '<UUID>';` y re-enrolar en `/mfa`.
- Paciente que olvida la clave: el admin genera una nueva (se le exigirá cambiarla).
- Conservación: los estudios son datos de salud sensibles (Ley 25.326 de Protección de Datos Personales; la historia clínica tiene plazos de conservación según la Ley 26.529). Definir con un asesor legal el plazo de retención y el texto de consentimiento/privacidad que debe mostrar el portal.
