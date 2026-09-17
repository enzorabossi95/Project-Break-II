# Project Break II. Backend
 
API de e-commerce hecha con Node.js, Express, Prisma (PostgreSQL en Supabase) y MongoDB (Mongoose). Tiene autenticación con JWT, roles de usuario, productos, reviews, wishlist y carrito con checkout. Documentación con Swagger.
 
## Tecnologías
 
- Node.js + Express
- Prisma + PostgreSQL (Supabase) para usuarios, productos, carrito y pedidos
- MongoDB (Mongoose) para reviews, wishlist y logs
- JWT + bcrypt para auth
- Helmet, CORS y rate limit para seguridad básica
- Swagger para documentar la API
- Jest para tests unitarios de los servicios

## Estructura
 
```
src/
├── config/       (prisma, mongo, swagger)
├── controllers/
├── services/
├── routes/
├── middlewares/
├── models/       (modelos de Mongo)
├── app.js
└── server.js
prisma/
└── schema.prisma
tests/
└── unit/
```
 
## Instalación
 
1. Instalar dependencias:
```
npm install
```
 
2. Crear un `.env` en la raíz con estas variables:
```
DATABASE_URL=postgresql://usuario:password@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://usuario:password@host:5432/postgres
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombre_db
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
PORT=3000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```
 
El servidor no arranca si falta `JWT_SECRET` o si no conecta a MongoDB.
 
3. Sincronizar el schema de Prisma:
```
npx prisma db push
npx prisma generate
```
 
4. Levantar el servidor:
```
npm start
```
Queda corriendo en `http://localhost:3000`.
 
5. Correr los tests:
```
npm test
```
 
6. Documentación Swagger en:
```
http://localhost:3000/api/docs
```
Para probar rutas con auth desde Swagger: el botón Authorize con `Bearer <token>` quedó desactualizado (la auth ahora es por cookie, no por header) — mejor probar esas rutas con cURL o Postman usando la cookie que devuelve el login, como en los ejemplos más abajo.
 
## Formato de respuesta
 
Éxito:
```json
{ "ok": true, "data": {} }
```
 
Error:
```json
{ "ok": false, "error": { "message": "..." } }
```
 
## Endpoints
 
### Sistema
- GET `/health` — estado del servidor
- GET `/api/docs` — swagger

### Auth
- POST `/api/auth/register` — registro (email, password)
- POST `/api/auth/login` — login, guarda el token en una cookie httpOnly (ya no lo devuelve en el body)
- POST `/api/auth/logout` — borra la cookie

### Usuarios
- GET `/api/users/profile` (auth) — perfil del usuario logueado

### Productos
- GET `/api/products` — listar
- GET `/api/products/:id` — obtener uno
- POST `/api/products` (ADMIN) — crear. Acepta `multipart/form-data` con un campo `image` (archivo) que se sube a Cloudinary; sin imagen queda `imageUrl: null`.
- PUT `/api/products/:id` (ADMIN) — actualizar. Mismo trato de imagen; si no se manda una nueva, se conserva la que ya tenía.
- DELETE `/api/products/:id` (ADMIN) — eliminar

### Reviews (Mongo)
- GET `/api/products/:id/reviews` — listar reviews de un producto
- POST `/api/products/:id/reviews` (auth) — crear review (rating 1-5 + comment)

### Wishlist (Mongo)
- GET `/api/wishlist` (auth) — ver wishlist
- POST `/api/wishlist/:productId` (auth) — agregar/sacar producto (toggle)

### Carrito
- GET `/api/cart` (auth) — ver carrito activo
- POST `/api/cart/items` (auth) — agregar producto al carrito. Valida stock disponible.
- DELETE `/api/cart/items/:itemId` (auth) — sacar producto del carrito
- POST `/api/cart/checkout` (auth) — cerrar compra y generar el pedido directo (sin pasar por Stripe). Valida y descuenta stock.

### Checkout con Stripe
- POST `/api/checkout/session` (auth) — crea una sesión de pago en Stripe a partir del carrito activo, devuelve la URL de pago
- POST `/api/checkout/confirm` (auth, body `{ sessionId }`) — verifica con Stripe que el pago se completó y recién ahí genera el pedido (misma lógica de `/api/cart/checkout` por dentro)

## Roles
 - USER: rol por defecto al registrarse. Puede ver productos, dejar reviews, usar wishlist y carrito.
 - ADMIN: además puede crear, editar y borrar productos.
 
## Ejemplos con cURL

La auth es por cookie, no por header. Para probar rutas que la necesitan hay que guardar y reenviar la cookie con `-c`/`-b`.

Registro:
```
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"user@test.com","password":"password123"}'
```
 
Login (guarda la cookie en `cookies.txt`):
```
curl -c cookies.txt -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@test.com","password":"password123"}'
```
 
Crear producto (con la cookie de un usuario ADMIN):
```
curl -b cookies.txt -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Cazadora Cuero","price":129.99,"stock":15}'
```
 
Agregar al carrito:
```
curl -b cookies.txt -X POST http://localhost:3000/api/cart/items -H "Content-Type: application/json" -d '{"productId":"<PRODUCT_ID>","quantity":2}'
```
 
## .env
 
El `.env` no se sube al repo, está en el `.gitignore`.

## Decisiones que se apartan un poco del tutorial

- El checkout de Stripe (`/api/checkout/confirm`) verifica con la API de Stripe que el pago se completó antes de crear el pedido, en vez de confiar directo en el cliente.
- Se agregó validación y descuento real de stock en `/api/cart/items` y en el checkout (no estaba antes — lo pidió la corrección de la entrega anterior).
- El descuento de stock en el checkout usa un `update` atómico con `WHERE stock >= cantidad` para que dos compras al mismo tiempo no vendan de más.
- **Categorías de producto:** se implementaron como campo de texto libre en `Product` (no como tabla `Category` separada) para priorizar velocidad de desarrollo dado el alcance del sprint (que solo pide CRUD de productos, no de categorías) y el tamaño chico del catálogo. Trade-off conocido: sin una tabla dedicada, el sistema no valida ni normaliza duplicados por typo (ej. "Lúpulos" vs "Lupulos" se tratarían como categorías distintas). Migrar a una tabla `Category` con relación a `Product` sería el siguiente paso natural si el catálogo creciera o hubiera múltiples admins cargando datos.
 