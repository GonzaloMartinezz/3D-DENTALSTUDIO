import { supabase } from '../lib/supabaseClient';

// Función para transformar DNI en un email interno o devolver el email si ya lo es
export const formatDniToEmail = (identificador: string) => {
  const trimmed = identificador.trim();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  return `${trimmed}@pacientes.local`;
};

// Iniciar sesión del paciente
export const loginPaciente = async (identificador: string, password: string) => {
  const email = formatDniToEmail(identificador);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Registrar un nuevo paciente (Usado por el Administrador)
export const registrarPaciente = async (dni: string, password: string, nombreCompleto: string, emailOpcional?: string) => {
  const email = emailOpcional || formatDniToEmail(dni);
  
  // 1. Crear el usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre_completo: nombreCompleto,
        dni: dni
      }
    }
  });

  if (authError) return { error: authError };
  if (!authData.user) return { error: new Error('Error al crear el usuario') };

  // 2. Crear el registro en la tabla personalizada 'perfiles_pacientes'
  const { error: profileError } = await supabase
    .from('perfiles_pacientes')
    .insert([
      { 
        id: authData.user.id, 
        dni: dni, 
        nombre_completo: nombreCompleto 
      }
    ]);

  return { data: authData, error: profileError };
};
