// hooks/useClase.ts — el mismo patrón de useClases, pero para UNA clase.
// El id va en las dependencias: si cambia la URL (/clases/1 → /clases/2),
// el efecto se repite y se pide la clase nueva.
import { useEffect, useState } from 'react';
import { traerClase } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';
import type { ClaseConHorarios } from '../tipos.ts';

// Lo que respondió la API, junto con la petición a la que pertenece.
interface Respuesta {
  peticion: string;
  clase: ClaseConHorarios | null;
  error: string | null;
}

export function useClase(id: number) {
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [intento, setIntento] = useState(0); // cambiarlo repite el efecto
  const peticion = `${id}-${intento}`;

  useEffect(() => {
    let vigente = true; // ¿este efecto sigue siendo el actual?
    const actual = `${id}-${intento}`;
    traerClase(id)
      .then((clase) => { if (vigente) setRespuesta({ peticion: actual, clase, error: null }); })
      .catch((e) => {
        if (vigente) setRespuesta({ peticion: actual, clase: null, error: mensajeDeError(e, 'No se pudo cargar la clase.') });
      });
    return () => { vigente = false; }; // la respuesta de un id viejo ya no se pinta
  }, [id, intento]);

  // Si la respuesta guardada es de otra petición (otro id u otro intento), seguimos cargando.
  const cargando = respuesta?.peticion !== peticion;

  function reintentar() {
    setIntento((n) => n + 1);
  }

  return {
    clase: cargando ? null : respuesta.clase,
    error: cargando ? null : respuesta.error,
    cargando,
    reintentar,
  };
}
