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
Para probar rutas con auth: hacer login, copiar el token, y usar el botón Authorize poniendo `Bearer <token>`.
 
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
- POST `/api/auth/login` — login, devuelve token

### Usuarios
- GET `/api/users/profile` (auth) — perfil del usuario logueado

### Productos
- GET `/api/products` — listar
- GET `/api/products/:id` — obtener uno
- POST `/api/products` (ADMIN) — crear
- PUT `/api/products/:id` (ADMIN) — actualizar
- DELETE `/api/products/:id` (ADMIN) — eliminar

### Reviews (Mongo)
- GET `/api/products/:id/reviews` — listar reviews de un producto
- POST `/api/products/:id/reviews` (auth) — crear review (rating 1-5 + comment)

### Wishlist (Mongo)
- GET `/api/wishlist` (auth) — ver wishlist
- POST `/api/wishlist/:productId` (auth) — agregar/sacar producto (toggle)

### Carrito
- GET `/api/cart` (auth) — ver carrito activo
- POST `/api/cart/items` (auth) — agregar producto al carrito
- DELETE `/api/cart/items/:itemId` (auth) — sacar producto del carrito
- POST `/api/cart/checkout` (auth) — cerrar compra y generar el pedido

## Roles
 - USER: rol por defecto al registrarse. Puede ver productos, dejar reviews, usar wishlist y carrito.
 - ADMIN: además puede crear, editar y borrar productos.
 
## Ejemplos con cURL
 
Registro:
```
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"user@test.com","password":"password123"}'
```
 
Login:
```
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"user@test.com","password":"password123"}'
```
 
Crear producto (con token de ADMIN):
```
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"name":"Cazadora Cuero","price":129.99,"stock":15}'
```
 
Agregar al carrito:
```
curl -X POST http://localhost:3000/api/cart/items -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"productId":"<PRODUCT_ID>","quantity":2}'
```
 
## .env
 
El `.env` no se sube al repo, está en el `.gitignore`.
 