# Practica 15 — El gimnasio: rutas y layout
## Jorge Cuevas Gastelum - 00000252274
## Topico de Aplicaciones Web 7:30 - 9:00 P:M

El frontend del gimnasio con React Router. Tiene un layout compartido
(encabezado y pie), el catalogo de clases con sus imagenes y el detalle de
cada clase con sus horarios, leyendo el id desde la URL.

Lo nuevo esta en src/main.tsx (el BrowserRouter), src/App.tsx (las rutas),
src/paginas/ (PaginaClases y PaginaClase) y src/hooks/useClase.ts. Lo demas
viene del codigo base.

Primero hay que tener corriendo gimnasio-backend en http://localhost:3000.
Luego se levanta con `npm install` y `npm run dev` y se abre en
http://localhost:5173.

Las capturas estan en la carpeta evidencias/.


## Preguntas — Ejercicio 1

### 1. ¿Por que el 404 si tiene encabezado y pie?

Porque la ruta `*` esta adentro de la ruta del layout. React Router primero
pinta el Layout, que trae el encabezado y el pie, y el 404 cae en su
Outlet como cualquier otra pagina.

Si la ruta `*` estuviera afuera del layout, el 404 saldria solo, sin
encabezado ni pie.

### 2. ¿Que cambia en la pestaña Red si usas `<a href>` en lugar de Link?

Con `<a href>` el navegador recarga la pagina completa. En la pestaña Red
sale una peticion de tipo document y despues se vuelve a descargar todo: el
html, el JavaScript, el CSS y el logo. React arranca de cero y se pierde lo
que tenia en memoria.

Con Link no se recarga nada. React Router cambia la URL y solo cambia la
pagina que va en el Outlet. En la pestaña Red solo sale el fetch a la API
(localhost:3000/clases/1) y la imagen de la clase.


## Preguntas — Ejercicio 2

### 1. ¿En que tipo de dato llega el id de la URL y que pasa si no lo conviertes?

Llega como string. La URL siempre es texto, asi que useParams regresa
"1", no 1.

Si no lo conviertes, TypeScript ni siquiera deja pasarlo a traerClase,
porque esa funcion pide un number. Y si lo forzaras, las comparaciones
fallarian sin avisar: "1" === 1 da false, y "1" + 1 da "11" en vez de 2.

Por eso en PaginaClase se hace Number(id). Si alguien escribe /clases/abc,
Number da NaN, el backend contesta 400 y la pagina muestra el error.

### 2. ¿Que pasa al ir de /clases/1 a /clases/2 si el id no esta en las dependencias del efecto?

La pagina se queda mostrando la clase 1 aunque la URL diga /clases/2.

Las dos URLs caen en la misma ruta, asi que React no desmonta PaginaClase,
nomas le cambia el parametro. Si el efecto tiene [] como dependencias, solo
corrio una vez al montar con el id 1 y no vuelve a correr. En la pestaña Red
ni siquiera aparece la peticion a /clases/2. Solo se arregla recargando.

Con el id en las dependencias, cada vez que cambia el id el efecto se repite
y pide la clase nueva.
