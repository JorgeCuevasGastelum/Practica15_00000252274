// App.tsx — el mapa de rutas del gimnasio.
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './componentes/Layout.tsx';
import { NoEncontrado } from './componentes/NoEncontrado.tsx';
import { PaginaClases } from './paginas/PaginaClases.tsx';
import { PaginaClase } from './paginas/PaginaClase.tsx';

export default function App() {
  return (
    <Routes>
      {/* Ruta de layout: no tiene path, sólo pinta el marco y su <Outlet />. */}
      <Route element={<Layout />}>
        {/* La portada redirige al catálogo. replace: no deja "/" en el historial. */}
        <Route index element={<Navigate to="/clases" replace />} />

        <Route path="clases">
          <Route index element={<PaginaClases />} />
          {/* Hija de "clases": /clases/:id */}
          <Route path=":id" element={<PaginaClase />} />
        </Route>

        {/* Cualquier otra dirección. Está DENTRO del layout: por eso lleva encabezado y pie. */}
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
