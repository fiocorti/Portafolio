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
4. Importá los estilos `src/styles/global.css`, `layout.css`, `components.css`, `dashboard.css`, `forms.css` y `tables.css` desde el punto de entrada principal (por ejemplo, `src/index.js`).
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

- `/admin` — Dashboard.
- `/admin/proyectos` — listado; `/nuevo`, `/:id`, `/:id/editar`.
- `/admin/demos` — listado; `/nueva`, `/:id`, `/:id/editar`.
- `/admin/servicios` — listado; `/nuevo`, `/:id`, `/:id/editar`.
- `/admin/usuarios` — listado, `/:id` detalle y `/:id/editar` edición limitada de usuario.
- `/admin/consultas` — listado, `/:id`, `/:id/responder`.
- `/admin/estadisticas` — gráficos e indicadores.
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
| `components/Sidebar.jsx` | Navegación y cierre de sesión | Layout | `useAuth`, React Router, lucide-react |
| `components/Header.jsx` | Encabezado responsive | Layout | `useAuth` |
| `components/StatCard.jsx` | Tarjeta de indicador | Dashboard / Estadísticas | Icono opcional |
| `components/DataTable.jsx` | Tabla reutilizable | Listados | EmptyState, LoadingState |
| `components/SearchBar.jsx` | Búsqueda | Listados | Estado controlado por la página |
| `components/StatusBadge.jsx` | Estado visual | Tablas y detalles | Sin API |
| `components/ConfirmModal.jsx` | Confirmación | CRUD | Callbacks |
| `components/FormField.jsx` | Campo de formulario | Formularios | Estado controlado |
| `components/ImageUploader.jsx` | URL y vista previa | Proyecto / Demo | Backend debe soportar URL o definirse multipart |
| `components/EmptyState.jsx` | Listado vacío | Tablas | Sin API |
| `components/LoadingState.jsx` | Carga | Páginas | Sin API |
| `components/ErrorMessage.jsx` | Error y reintento | Páginas | Error HTTP |
| `components/EntityListPage.jsx` | Listado CRUD reutilizable | Proyectos, demos, servicios, usuarios, consultas | Servicios de cada entidad |
| `components/EntityFormPage.jsx` | Formulario crear/editar reutilizable | Proyectos, demos, servicios | POST/PUT |
| `components/EntityDetailPage.jsx` | Vista de detalle reutilizable | Proyectos, demos, servicios | GET por ID |
| `components/Toast.jsx` | Mensajes temporales | Formularios y acciones | Estado local |
| `pages/usuarios/UsuarioEdit.jsx` | Edición limitada de datos de usuario | Detalle de usuario | `PUT /api/admin/usuarios/:id` |
| `layouts/AdminLayout.jsx` | Estructura del panel | Todas las rutas `/admin` | Sidebar, Header |
| `routes/AdminRoutes.jsx` | Navegación y protección visual | App | AuthProvider, API de sesión |
| `hooks/AuthProvider.jsx` | Estado de sesión | App | `GET /api/auth/me`, `POST /api/auth/logout` |
| `hooks/useAuth.js` | Acceso al contexto | Componentes | AuthProvider |
| `services/api.js` | Cliente HTTP central | Servicios | `REACT_APP_API_URL` |
| `services/*Service.js` | Operaciones por entidad | Páginas | Endpoints indicados arriba |
| `mocks/mockData.js` | Datos temporales demostrativos | Modo mocks | localStorage del navegador |

## Seguridad y límites conocidos

- La protección de rutas en React es solamente visual. Express debe autorizar cada operación según el rol y validar los datos recibidos.
- La gestión de usuarios permite editar nombre, correo y estado; en cuentas ajenas también permite elegir entre usuario y operador. La interfaz no ofrece asignar el rol administrador ni cambiar el propio rol. Express debe validar igualmente cada modificación.
- Las métricas del modo demo son ficticias y están identificadas como demostración.
- La respuesta de consultas en modo demo solo modifica datos locales; no envía emails.
- La imagen se administra mediante URL. Para subir archivos se debe acordar un endpoint multipart con el backend.
- El diseño de permisos distingue administrador y operador en navegación; el backend debe confirmar qué endpoints puede usar cada rol.

## Tecnologías
React 17.0.2 · React Router DOM 5.1.0 · react-scripts 5.0.1 · Chart.js 3.9.1 · react-chartjs-2 4.3.1 · lucide-react 0.468.0.
