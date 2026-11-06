# Frontend Administrativo — Portfolio personal

Módulo administrativo desarrollado para **React 17.0.2**, **React Router DOM 5.1.0** y **Create React App 5.0.1**, compatible con la configuración que informó el equipo.

## Requisitos
- Node.js compatible con `react-scripts@5.0.1` (recomendado Node 16 o 18 para evitar incompatibilidades con proyectos CRA antiguos).
- npm.

## Instalación y ejecución

```bash
npm install
```

Copiá `.env.example` como `.env.local` y ajustá las variables. Para probar sin backend:

```env
REACT_APP_USE_MOCKS=true
REACT_APP_API_URL=http://localhost:3001
REACT_APP_LOGIN_URL=/login
```

Luego ejecutá:

```bash
npm start
```

El modo de demostración usa datos ficticios y `localStorage` del navegador. **No guarda información en MySQL ni envía correos reales.** Para conectar el backend, configurá `REACT_APP_USE_MOCKS=false`, establecé `REACT_APP_API_URL` y acordá los endpoints y formatos JSON con los integrantes 3 y 4.

## Integración en el repositorio del grupo

Este ZIP es una aplicación CRA independiente para que pueda probarse fácilmente. Para incorporarla al repositorio compartido:

1. No reemplaces el `package.json` del proyecto público sin revisar sus dependencias.
2. Copiá `src/components`, `src/layouts`, `src/pages`, `src/services`, `src/hooks`, `src/mocks`, `src/routes` y `src/styles` al proyecto común (resolviendo conflictos de nombres si ya existen).
3. Conservá la única instancia de `BrowserRouter` de la aplicación principal. En el `App` general agregá `AdminRoutes` dentro del router existente; **no agregues otro `BrowserRouter` alrededor de `AdminRoutes`**.
4. Importá los estilos `src/styles/global.css`, `layout.css`, `components.css`, `dashboard.css`, `forms.css`, `tables.css`, `visual.css` y `cards.css` desde el punto de entrada principal (en esta plantilla, `src/main.jsx`). El orden importa: `visual.css` y `cards.css` van al final.
5. Usá un solo proveedor/contexto de autenticación. Si el grupo ya integra el contexto del integrante 3, adaptá `AdminRoutes` y reemplazá `useAuth` por el hook compartido en lugar de duplicar `AuthProvider`.
6. Asegurate de que el integrante 1 tenga una ruta pública `/login` o ajustá `REACT_APP_LOGIN_URL`.
7. Mantené un único mecanismo de sesión. Este módulo consulta `GET /api/auth/me`, usa cookies con `credentials: 'include'` y solicita `POST /api/auth/logout`; adaptar según lo acordado con el integrante 3.
8. Verificá que el servidor habilite CORS con credenciales si frontend y backend usan distintos orígenes.

Ejemplo de integración en el router existente:

```jsx
import AdminRoutes from './routes/AdminRoutes';

function AppRoutes() {
  return (
    <Switch>
      {/* Rutas públicas del integrante 1 */}
      <Route path="/admin" component={AdminRoutes} />
    </Switch>
  );
}
```

En esta plantilla `AdminRoutes` incluye su propia `Switch` para rutas `/admin`. Si se monta con `Route path="/admin"`, no se debe añadir otro `BrowserRouter`.

## Rutas incluidas

- `/admin` — **Estadísticas** (página unificada: resumen de indicadores, gráficos, actividad reciente, consultas pendientes y accesos rápidos). Reemplaza al antiguo Dashboard.
- `/admin/proyectos` — listado; `/nuevo`, `/:id`, `/:id/editar`.
- `/admin/demos` — listado; `/nueva`, `/:id`, `/:id/editar`.
- `/admin/servicios` — listado; `/nuevo`, `/:id`, `/:id/editar`.
- `/admin/usuarios` — listado, `/:id` detalle y `/:id/editar` edición limitada de usuario.
- `/admin/consultas` — listado, `/:id`, `/:id/responder`.
- `/admin/estadisticas` — redirige a `/admin` (se mantiene para enlaces antiguos).
- `/admin/configuracion` — preferencias locales y cuenta.

## Endpoints que deben acordarse con backend

### Integrante 3 — usuarios y comunicación
- `GET /api/auth/me` — sesión y usuario actual.
- `POST /api/auth/logout` — cierre de sesión.
- `GET /api/admin/usuarios` y `GET /api/admin/usuarios/:id`.
- `PUT /api/admin/usuarios/:id` — actualización de campos permitidos (nombre, email, estado y rol solo si el servidor lo autoriza).
- `GET /api/contactos` y `GET /api/contactos/:id`.
- `POST /api/contactos/:id/responder` — recibe `{ "respuesta": "..." }`.

### Integrante 4 — contenido y estadísticas
- `GET /api/admin/proyectos`, `POST /api/admin/proyectos`, `GET/PUT/DELETE /api/admin/proyectos/:id`.
- `GET /api/admin/demos`, `POST /api/admin/demos`, `GET/PUT/DELETE /api/admin/demos/:id`.
- `GET /api/admin/servicios`, `POST /api/admin/servicios`, `GET/PUT/DELETE /api/admin/servicios/:id`.
- `GET /api/admin/estadisticas` — contadores, visitas, distribución y actividad.

Las rutas son el contrato propuesto por este frontend, no una afirmación de que ya existan en el backend. Las respuestas de listados deben devolver `{ "items": [] }` (o un array directo); las respuestas de detalle pueden devolver `{ "item": {} }` (o un objeto directo). Los errores deberían usar `{ "message": "..." }` y códigos HTTP apropiados.

## Índice de componentes

| Archivo | Función | Utilizado en | Dependencias / API |
|---|---|---|---|
| `components/Sidebar.jsx` | Navegación, cierre de sesión y pie decorativo | Layout | `useAuth`, React Router, lucide-react |
| `components/Header.jsx` | Encabezado responsive | Layout | `useAuth` |
| `components/PageHeader.jsx` | Banda decorativa de encabezado (degradado + puntos) | Todas las páginas | React Router (`backTo`) |
| `components/StatCard.jsx` | Indicador con conteo animado, tono y enlace opcional (`to`) | Estadísticas | `hooks/useCountUp`, icono opcional |
| `hooks/useCountUp.js` | Cuenta de 0 al valor final una vez; respeta reduced motion | StatCard | Sin API |
| `pages/Estadisticas.jsx` | Página unificada: indicadores, gráficos y actividad | `/admin` | `GET /api/admin/estadisticas`, Chart.js |
| `components/DataTable.jsx` | Tabla reutilizable | Listados (vista tabla) | EmptyState, LoadingState |
| `components/EntityListPage.jsx` | Listado CRUD: búsqueda, chips de filtro, vista tarjetas/tabla y paginación | Proyectos, demos, servicios, usuarios, consultas | Servicios de cada entidad |
| `components/EntityCard.jsx` | Tarjeta visual de un registro (portada 16:9 o glifo), chips y acciones al hover | Listados de proyectos, demos y servicios; vista previa | `Cover`, `StatusBadge` |
| `components/EntityPreview.jsx` | Vista previa en vivo de la tarjeta a partir de los valores del formulario | Formularios de proyectos y demos | `EntityCard` |
| `components/Cover.jsx` | Imagen de portada con carga, zoom suave y placeholder con la inicial | Tarjetas, detalle (hero) | Sin API |
| `components/FilterChips.jsx` | Filtros como chips (reemplazan al selector) | `EntityListPage` | Sin API |
| `components/ViewToggle.jsx` | Alternar entre tarjetas y tabla (se recuerda en `localStorage`) | `EntityListPage` | Sin API |
| `components/EntityFormPage.jsx` | Formulario crear/editar: secciones en tarjetas, validación en línea, vista previa y confirmación | Proyectos, demos, servicios | POST/PUT |
| `components/FormSection.jsx` | Tarjeta con título e ícono para agrupar campos | `EntityFormPage` | Sin API |
| `components/FormField.jsx` | Campo de formulario con ícono de válido, contador y mensajes | Formularios | Estado controlado |
| `components/TagInput.jsx` | Tecnologías como chips (Enter o coma agregan, X quita) | `EntityFormPage` | Entrega el mismo texto separado por comas |
| `components/SegmentedControl.jsx` | Selector segmentado para el estado (Publicado / Borrador) | `EntityFormPage` | Radios accesibles |
| `components/ImageUploader.jsx` | URL con vista previa 16:9 y estados de carga, error y URL inválida | Proyecto / demo | Backend debe soportar URL o definirse multipart |
| `components/EntityDetailPage.jsx` | Detalle con portada hero, chips y enlaces como botones | Proyectos, demos, servicios | GET por ID |
| `components/SearchBar.jsx` | Búsqueda | Listados | Estado controlado por la página |
| `components/StatusBadge.jsx` | Estado visual | Tablas, tarjetas y detalles | Sin API |
| `components/ConfirmModal.jsx` | Confirmación | CRUD | Callbacks |
| `components/EmptyState.jsx` | Listado vacío | Tablas y tarjetas | Sin API |
| `components/LoadingState.jsx` | Carga | Páginas | Sin API |
| `components/ErrorMessage.jsx` | Error y reintento | Páginas | Error HTTP |
| `components/Toast.jsx` | Mensajes temporales | Formularios y acciones | Estado local |
| `pages/usuarios/UsuarioEdit.jsx` | Edición limitada de datos de usuario | Detalle de usuario | `PUT /api/admin/usuarios/:id` |
| `layouts/AdminLayout.jsx` | Estructura del panel y capa de fondo decorativa | Todas las rutas `/admin` | Sidebar, Header |
| `routes/AdminRoutes.jsx` | Navegación y protección visual | App | AuthProvider, API de sesión |
| `hooks/AuthProvider.jsx` | Estado de sesión | App | `GET /api/auth/me`, `POST /api/auth/logout` |
| `hooks/useAuth.js` | Acceso al contexto | Componentes | AuthProvider |
| `utils/format.js` | Fechas en hora local y host de una URL | Tarjetas | Sin API |
| `services/api.js` | Cliente HTTP central | Servicios | `REACT_APP_API_URL` |
| `services/*Service.js` | Operaciones por entidad | Páginas | Endpoints indicados arriba |
| `mocks/mockData.js` | Datos temporales demostrativos | Modo mocks | localStorage del navegador |

## Seguridad y límites conocidos

- La protección de rutas en React es solamente visual. Express debe autorizar cada operación según el rol y validar los datos recibidos.
- La gestión de usuarios permite editar nombre, correo y estado; en cuentas ajenas también permite elegir entre usuario y operador. La interfaz no ofrece asignar el rol administrador ni cambiar el propio rol. Express debe validar igualmente cada modificación.
- Las métricas del modo demo son ficticias y están identificadas como demostración.
- El gráfico de visitas muestra los 7 días que entrega el contrato de estadísticas. No hay selector de 30 días porque el backend no entrega esa serie; los tooltips comparan cada día contra el promedio.
- La respuesta de consultas en modo demo solo modifica datos locales; no envía emails.
- La imagen se administra mediante URL. Para subir archivos se debe acordar un endpoint multipart con el backend.
- El diseño de permisos distingue administrador y operador en navegación; el backend debe confirmar qué endpoints puede usar cada rol.

## Sistema visual

Basado en la guía «Sistema visual compartido v1.0», variante clara para administración. Todos los valores viven como variables CSS en `src/styles/global.css` (`:root`); los demás archivos de estilos no usan colores sueltos. Los gráficos de Chart.js toman sus colores de la misma paleta (constante `palette` en `pages/Estadisticas.jsx`). No se agregaron librerías: solo CSS propio y JavaScript de React.

### Paleta

| Uso | Variable | Valor |
|---|---|---|
| Fondo | `--color-bg` | `#F8FAFC` |
| Tarjetas | `--color-surface` | `#FFFFFF` |
| Texto | `--color-text` | `#0F172A` |
| Texto secundario | `--color-text-muted` | `#475569` |
| Acción / botones | `--color-primary` (hover `--color-primary-hover`) | `#4338CA` (`#3730A3`) |
| Acento | `--color-accent` | `#22D3EE` (texto sobre claro: `--color-accent-text`, `#0E7490`) |
| Tintes | `--tint-indigo`, `--tint-cyan`, `--tint-slate` | `#EEF2FF`, `#ECFEFF`, `#EEF2F7` |
| Degradado de marca | `--gradient-brand` | índigo → índigo oscuro → cian oscuro |
| Éxito / advertencia / error | `--color-success`, `--color-warning`, `--color-danger` | `#10B981`, `#F59E0B`, `#EF4444` |
| Sidebar (base de la marca) | `--brand-bg` / `--brand-surface` | `#0B1220` / `#17243A` |
| Superficie oscura de marca (servicios, chips alternados) | `--color-violet`, `--color-violet-text`, `--tint-violet` | `#17243A`, `#0E7490`, `#EEF2F7` |
| Degradado intenso (marca) | `--gradient-brand-rich` | `#312E81` → `#4338CA` → `#0E7490` |
| Degradado cian / superficie oscura | `--gradient-cyan`, `--gradient-violet` | portadas de demos y servicios |

Criterio: el índigo se usa para acciones, el cian como acento y los colores de estado solo para feedback (badges, avisos, errores). Para texto pequeño sobre fondos claros se usan variantes más oscuras de los estados (`--color-success-text`, `--color-warning-text`, `--color-danger-text`).

### Decoraciones

- **Fondo**: degradado suave entre `#F8FAFC` y tintes índigo/cian (`--gradient-page`) con tres formas difusas (`.blob-*` dentro de `.ambient`, en `AdminLayout`). Son fijas, no se animan, y quedan detrás del contenido.
- **Banda de encabezado** (`.page-band`, usada por `PageHeader`): degradado claro, patrón de puntos muy sutil y una barra de acento a la izquierda.
- **Tarjetas tintadas**: se alternan superficies blancas con tintes índigo, cian y gris azulado (`.tint-indigo`, `.tint-cyan`, `.tint-slate`) y tarjetas destacadas con degradado de marca (`.panel-brand`, `.stat-brand`). Bordes sutiles y sombras con tinte índigo (`--shadow-md`, `--shadow-lift`).
- **Sidebar**: base oscura de la marca con textura de puntos; el ítem activo tiene brillo cian suave con halo; el pie muestra un indicador cian y la etiqueta del sistema visual.
- **Portadas sin imagen**: placeholder con degradado de marca, puntos y la inicial del registro (nunca un cuadro gris).

### Color por entidad y sección

- **Proyectos** usan portadas e ícono índigo; **demos**, cian; **servicios**, superficie oscura de marca con acento cian. Las portadas sin imagen muestran la inicial en peso 800 sobre ese degradado.
- Los chips de tecnologías alternan tres tonos: índigo, cian y gris azulado (tintes de la guía).
- El badge de estado en la portada tiene borde del color del estado (éxito, advertencia, neutro o info).
- Los indicadores tienen una franja superior de color por tono. El tono `brand` usa `--gradient-brand-rich`; el `accent` tiene un fondo cian más saturado.
- En el formulario cada sección tiene su color: Información índigo, Imagen cian, Tecnologías superficie oscura de marca, Características índigo y Publicación índigo. Ningún color de estado se usa como decoración.
- El gráfico de visitas tiene un relleno índigo-cian más intenso. El doughnut usa la paleta de la guía: índigo, cian, superficie oscura de marca y tintes.
- La banda de encabezado usa un degradado índigo → cian con patrón de puntos más visible. Cada página muestra el ícono de su sección en un recuadro de marca a la izquierda del título (`PageHeader`, con `icon`; el ícono de listados, formularios y detalles sale de `components/sectionIcons.js`).

### Movimiento e interacción

- Los indicadores cuentan desde 0 hasta su valor la primera vez que aparecen (`hooks/useCountUp.js`).
- Las tarjetas y los indicadores se elevan al pasar el mouse (`.hover-lift`, `.entity-card`). Las filas de tabla resaltan con borde lateral índigo y las acciones se destacan al pasar.
- Entrada escalonada de tarjetas y secciones con `.reveal`: corre una sola vez al montar, con `animation-fill-mode: backwards`, así no interfiere con la elevación del hover.
- Las acciones de las tarjetas (ver / editar / eliminar) aparecen al pasar el mouse o al tener foco por teclado, y quedan siempre visibles en móvil y en dispositivos táctiles.
- Duraciones entre 150 y 250 ms. Con `prefers-reduced-motion: reduce` se desactivan las animaciones de entrada, el pulso del indicador y el shimmer de carga; los valores se muestran directamente.

### Vistas

- **Proyectos, demos y servicios**: el listado tiene vista de tarjetas (predeterminada) y vista de tabla, alternables con `ViewToggle`. La elección se recuerda en `localStorage`. Búsqueda, filtros y paginación funcionan igual en ambas vistas.
- **Filtros**: chips clickeables (`FilterChips`) en todos los listados. El filtro compara estado y rol, así que también sirve para usuarios.
- **Detalle**: hero a ancho completo con el estado y el título. Sin imagen muestra el ícono de la sección sobre el tono de la entidad. Debajo, dos tarjetas: la descripción con sus enlaces como botones, y la información como lista de filas con separadores. Las tecnologías y características van como chips.
- **Crear / editar proyecto y demo**: dos columnas. El formulario agrupa los campos en tarjetas con título (Información, Imagen, Tecnologías, Publicación) y la vista previa de la tarjeta a la derecha se actualiza mientras se escribe. En pantallas angostas la vista previa queda debajo del formulario.
- **Servicios**: mismo formulario por secciones, sin vista previa, porque no tienen imagen.
- **Servicios (listado y detalle)**: tarjetas con ícono de marca en superficie oscura y acento cian, las primeras tres características con check y el resto en "+n más". El detalle muestra un hero con el ícono del servicio, las características numeradas en una cuadrícula y una ficha lateral.
- **Validación en línea**: los errores aparecen al salir del campo (o al intentar guardar); los campos válidos muestran un ícono de confirmación. Las URL se validan con `http://` o `https://`.
- **Imagen**: la vista previa 16:9 indica si está vacía, cargando, lista, con URL inválida o con error de carga.
- **Tecnologías**: campo de chips. Enter o coma agregan, la X quita y Backspace con el campo vacío quita el último. Internamente sigue enviando el mismo texto separado por comas, así que el payload no cambia.
- **Estado**: selector segmentado (Publicado / Borrador) con radios accesibles.
- **Descripción**: contador de caracteres con 300 como referencia recomendada. Es orientativo: no bloquea el guardado.
- **Guardar**: el botón muestra "Guardando…" mientras envía y "Guardado" al confirmar, antes de volver al listado.

### Accesibilidad y responsive

- Contraste AA en todos los textos: el texto sobre degradados de marca es blanco, y los tintes solo se usan como fondo de texto oscuro.
- Foco visible (`:focus-visible`) en todos los controles, incluidos los radios del selector segmentado y los chips. Los botones de ícono tienen `aria-label`. `Escape` cierra el menú móvil y los modales.
- Grillas de indicadores 4 → 2 → 1 columnas; grilla de tarjetas de ancho automático; los filtros en chips se desplazan horizontalmente en móvil; el sidebar se vuelve un menú deslizable con botón hamburguesa por debajo de 760 px.

### Tipografía

- **Inter** (400/500/600/700): títulos, navegación, botones, formularios y textos.
- **JetBrains Mono** (400/500/600): solo datos técnicos (valores de los indicadores, IDs, etiquetas de tecnologías, metadatos de las tarjetas, paginación).
- Ambas se cargan desde Google Fonts en `public/index.html` (`preconnect` + `display=swap`) con fallback `system-ui` / `monospace`.

| Elemento | Escritorio | Móvil | Peso |
|---|---|---|---|
| H1 (título de página) | 32 px / 1.15 | 28 px | 700 |
| H2 (sección) | 22 px / 1.25 | 20 px | 700 |
| H3 (tarjeta) | 17 px / 1.3 | 17 px | 600 |
| Texto general | 16 px / 1.6 | 16 px | 400 |
| Texto pequeño | 14 px / 1.5 | 14 px | 400 / 500 |

La guía define H1 en 44 px para el sitio público; en el panel la escala se reduce proporcionalmente porque conviven tablas y formularios densos.

### Archivos de estilos

| Archivo | Contenido |
|---|---|
| `global.css` | Variables (paleta, tintes, degradados, sombras, movimiento), base tipográfica, foco, `.sr-only`. |
| `layout.css` | Estructura, sidebar (brillo del activo y pie), barra superior, responsive del menú. |
| `components.css` | Botones, paneles, badges, búsqueda, estados de carga/error, toast, modal, tablas de acción. |
| `dashboard.css` | Indicadores y tonos, gráficos, actividad, accesos rápidos, configuración. |
| `forms.css` | Campos, secciones, layout con vista previa, selector segmentado, chips de tecnologías, portada 16:9. |
| `tables.css` | Tablas (hover marcado), barra de herramientas, chips de filtro, paginación. |
| `visual.css` | Fondo ambiental, banda de encabezado, tintes de paneles, animaciones de entrada y elevación. |
| `cards.css` | Tarjetas de entidad, portadas, chips, toggle de vista, detalle hero. |
| `services.css` | Servicios: tarjeta de listado y detalle con diseño propio (superficie oscura de marca con acento cian). |

## Tecnologías
React 17.0.2 · React Router DOM 5.1.0 · react-scripts 5.0.1 · Chart.js 3.9.1 · react-chartjs-2 4.3.1 · lucide-react 0.468.0.
