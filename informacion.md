# Collection Tracker - Informacion del Proyecto

## Descripcion
Aplicacion web para gestion de colecciones personales con sistema de autenticacion de usuarios.

## URL de Figma
https://www.figma.com/file/collection-tracker-design-system

## Tecnologias Utilizadas
- Jakarta EE (Servlets)
- MySQL 8.0
- Docker + Docker Compose
- Vanilla HTML, CSS, JavaScript

## Caracteristicas
- Sistema de registro e inicio de sesion
- Colecciones vinculadas a cada usuario
- CRUD completo de colecciones e items
- Eliminacion de base de datos personal
- Diseño responsivo (desktop, tablet, movil)
- Peticiones asincronas con fetch y promesas

## Despliegue en Railway (Plan Free)

### Crear cuenta
1. Ir a https://railway.com y crear cuenta (plan Free Trial, $5 de credito por 30 dias, no requiere tarjeta)
2. Instalar Railway CLI: `npm i -g @railway/cli`
3. Hacer login: `railway login`

### Subir codigo a GitHub
1. Crear repositorio en GitHub
2. Subir el proyecto: `git push origin main`

### Crear proyecto en Railway
1. Railway Dashboard -> + New Project -> Empty Project
2. **MySQL**: + New -> Docker Image -> imagen: `mysql:8.0`
   - Variables: `MYSQL_ROOT_PASSWORD` (generar secreto), `MYSQL_DATABASE=collection_db`
   - Volume: Ruta `/var/lib/mysql`
3. **App**: + New -> GitHub Repo -> seleccionar repositorio
   - Railway detecta automaticamente el Dockerfile
   - Variables (usando variables de referencia):
     - `DB_HOST=${{mysql.RAILWAY_PRIVATE_DOMAIN}}`
     - `DB_PORT=3306`
     - `DB_NAME=collection_db`
     - `DB_USER=root`
     - `DB_PASSWORD=${{mysql.MYSQL_ROOT_PASSWORD}}`
   - Settings -> Networking -> Generate Domain (URL publica)
4. **Inicializar BD**: Activar TCP Proxy en MySQL, conectar y ejecutar `mysql/init/01-init.sql`

### Gestion de costes
- Los 2 servicios cuestan ~$1.66/dia funcionando 24h
- El credito de $5 del trial cubre ~3 dias de funcionamiento continuo
- Parar los servicios cuando no se usen para ahorrar credito

## Credenciales Demo
- Usuario: demo
- Contraseña: demo123
- Nota: Registra un nuevo usuario con email terminado en @admin.com para acceder al panel de administrador
