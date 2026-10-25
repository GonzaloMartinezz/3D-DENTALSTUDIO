import 'server-only';
import { randomInt } from 'node:crypto';

// Sin caracteres ambiguos (0/O, 1/l/I) para dictarla por teléfono o imprimirla.
const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

export function generarPasswordTemporal(largo = 10) {
  return Array.from({ length: largo }, () => ALFABETO[randomInt(ALFABETO.length)]).join('');
}
