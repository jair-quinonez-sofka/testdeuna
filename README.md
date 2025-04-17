# Aplicación de Gestión de Productos

## Descripción Técnica

Esta aplicación es un sistema de gestión de productos construido con NestJS, siguiendo una arquitectura de microservicios. Consta de dos servicios principales:

1. **BFF de Gestión de Productos (Backend-For-Frontend)**: Actúa como puerta de enlace API que maneja las solicitudes del cliente y se comunica con el servicio backend.
2. **Backend de Gestión de Productos**: Servicio principal responsable de la lógica de negocio y operaciones de datos.

La aplicación utiliza las siguientes tecnologías:
- **NestJS**: Un potente framework de Node.js que permite la creación de aplicaciones escalables y eficientes en el servidor.
- **GraphQL**:  Un lenguaje de consulta de API, implementado a través de Apollo Server en el BFF, para proporcionar una interfaz de datos flexible.
- **API REST**: Un conjunto de endpoints REST tradicionales para operaciones específicas.
- **PostgreSQL**: Un motor de base de datos relacional que utiliza TypeOrm como ORM.
- **Redis**: Un almacenamiento en caché para mejorar el rendimiento.
- **Kafka**: Un sistema de mensajería para comunicación asíncrona entre servicios.
- **Docker**: Un entorno de contenedores para la configuración de entornos de desarrollo y despliegue consistentes.
- **KafkaDrop**: Una herramienta de visualización de mensajes para Kafka.

## Diagrama de Arquitectura

 [Diagrama de Arquitectura](./ARCH_TEST_DEUNA.png)


## Configuración del Entorno

### Prerequisitos
- Docker y Docker Compose
- Node.js (v18+)
- npm

### Métodos de Configuración

Esta aplicación ofrece un método de configuración para adaptarse a diferentes flujos de trabajo:

| Método | Caso de uso | Ventajas | Configuración |
|--------|-------------|----------|---------------|
| **Docker Compose (Prod)** | Producción, CI/CD | Entorno completo aislado | `docker compose up` |

### 1. Configuración con Docker Compose (Producción)

Este método inicia **todos** los servicios en contenedores Docker, ideal para entornos de producción o pruebas.

```bash
# Clonar el repositorio
git clone 
cd testdeuna

# Configurar variables de entorno
cp .env.example .env
# Editar .env según necesidades

# Contruir imagen de Docker de BFF y API Rest
docker compose build

# Ejecutar todos los servicios
docker compose up
```

Con esta configuración:
- Los servicios se ejecutan en contenedores aislados
- Las redes están configuradas internamente
- No es necesario instalar dependencias localmente
- Los servicios se mapean a los siguientes puertos:
  - Backend: Accesible en el puerto 4000 (mapeo interno al 3000)
  - BFF: Accesible en el puerto 4001 (mapeo interno al 400)
  - PostgreSQL: Accesible en el puerto 5432 (mapeo interno al 5432)
  - Redis: Accesible en el puerto 6379 (mapeo interno al 6379)
  - Kafka: Accesible en el puerto 9092 (mapeo interno al 29092)
  - Kafka Drop: Accesible en el puerto 9000 (mapeo interno al 9000)

### 2. Configuración con Docker Compose (Desarrollo Local)

Este método inicia solo los servicios de infraestructura en Docker, mientras que los servicios de aplicación se ejecutan localmente para facilitar el desarrollo.

```bash
# Clonar el repositorio e instalar dependencias
git 
cd testdeuna/api-product-manager
npm install

cd ../bff-product-manager   
npm install

# Configurar variables de entorno para desarrollo local
cp .env.example .env
# Modificar .env con los siguientes valores:
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=products
# DB_PORT=5432
# REDIS_HOST=redis
# REDIS_PORT=6379

# Iniciar servicios de infraestructura
docker compose -f docker-compose.local.yml up -d


# Iniciar servicios en terminales separadas
# cd api-product-manager
npm start:dev  # Terminal 1 (Puerto 3000)

# cd bff-product-manager
npm start:dev      # Terminal 2 (Puerto 4000)
```

Con esta configuración:
- Solo PostgreSQL, Redis y Kafka se ejecutan en Docker con los siguientes puertos:
  - PostgreSQL: Accesible en el puerto 5432
  - Redis: Accesible en el puerto 6379
  - Kafka: Accesible en el puerto 9092
  - Kafka UI: Accesible en el puerto 8080
- Los servicios de aplicación se ejecutan localmente con hot-reload:
  - API Rest: Se ejecuta localmente en el puerto 3000   
  - BFF: Se ejecuta localmente en el puerto 4000

## Configuración de Variables de Entorno

Las variables de entorno son esenciales para la configuración del sistema. El proyecto utiliza un archivo `.env` para gestionar estas variables.


## Ejecución de Pruebas

### Pruebas Unitarias
```bash
# Ejecutar todas las pruebas unitarias
npm test

# Ejecutar pruebas en modo watch
npm test:watch

# Ejecutar pruebas con cobertura
npm test:cov
```


### Depuración de Pruebas
```bash
npm test:debug
```

## Scripts Útiles



### Calidad de Código
```bash
# Formatear código
npm format

# Ejecutar linter
npm lint

# Ejecutar pruebas
npm test           # Todas las pruebas
```

### Producción
```bash
# Construir aplicación
npm build

# Iniciar en modo producción
npm start:prod
```

## Postman
A continuación se detalla cómo utilizar las colecciones Postman proporcionadas para probar la API de gestión de productos, los archivos se encuentran en la carpeta `postman` del proyecto.

### Colecciones

1. **INTEGRATION_TEST_DEUNA.postman_collection.json** - Pruebas de integración que cubren flujos completos entre BFF y Backend
2. **TEST_DEUNA_API_REST.postman_collection.json** - Para probar la API REST del Backend

### Configuración del entorno

La colección utiliza variables de entorno para facilitar las pruebas en diferentes ambientes. Se proporciona un archivo de entorno predeterminado:

- **NTEGRATION_TEST_ENV.postman_environment.json**

### Variables de entorno

Para ambientes de desarrollo local (docker-compose.local.yml + servicios locales):
- `backend_url`: URL base para el servicio Backend (http://localhost:3000)
- `bff_url`: URL base para el servicio BFF (http://localhost:4000)

Para ambientes de producción con Docker Compose (docker-compose.yml):
- `backend_url`: URL base para el servicio Backend (http://localhost:3000)
- `bff_url`: URL base para el servicio BFF (http://localhost:4000)

### Guía de uso

#### Importar las colecciones y el entorno

1. Abre Postman
2. Haz clic en "Import" en la esquina superior izquierda
3. Importa los 4 archivos JSON (colecciones y el entorno) haciendo clic en los seleccionados o arrastrnadolos.
4. Confirma la importación

#### Seleccionar el entorno

1. Debes seleccionar "DeUna Environment" del menú desplegable de entornos

#### Pruebas de la API BFF (GraphQL)

La colección BFF contiene operaciones GraphQL para:

- Consultas (Queries):
  - `getProducts`: Obtener todos los productos
  - `getProduct`: Obtener un producto por ID

- Mutaciones (Mutations):
  - `createProduct`: Crear un nuevo producto
  - `updateProduct`: Actualizar un producto existente
  - `removeProduct`: Eliminar un producto

#### Pruebas de la API Backend (REST)

La colección Backend contiene solicitudes para:
- Obtener todos los productos (GET /getAll)
- Obtener un producto por ID (GET /getById/{id})
- Crear un nuevo producto (POST /create)
- Actualizar un producto (POST /update)
- Eliminar un producto (POST /remove)
- Acceder a la documentación Swagger (GET /api)

#### Ejecución de las pruebas de integración

La colección de pruebas de integración está diseñada para ejecutarse secuencialmente y validar que:
1. Se pueda crear un producto desde el BFF
2. Se pueda obtener los productos desde el BFF con paginación   
3. Se pueda obtener todos los productos desde el BFF
3. Se pueda actualizar el producto desde el BFF
4. Se pueda eliminar el producto desde el BFF

Para ejecutar todas las pruebas:
1. Abre la colección "INTEGRATION_TEST_DEUNA"
2. Haz clic en los tres puntos
3. Selecciona "Run"
4. Haz clic en "Run"

### Notas adicionales

- Las colecciones incluyen pruebas automatizadas (con scripts de test) que validan las respuestas
- Algunas solicitudes almacenan automáticamente datos (como IDs) en variables para usarlos en solicitudes posteriores
- Las colecciones están documentadas con descripciones detalladas para cada solicitud


## Ejemplos

### Ejemplos de BBF (GraphQL)

#### Consultar todos los productos
```graphql
{
  getProducts {
    size
    products {
      id
      name
      description
      stock
      price
      
    }
  }
}
```

#### Obtener producto por ID
```graphql
{
  getProduct(id: "10e32a5d-0584-4b9e-a5eb-2ea5bd75f836") {  
    id
    name
    description
    price
    stock
  }
}
```

#### Crear nuevo producto
```graphql
mutation {
  createProduct({
    name: "Test",
    description: "This is my description about this thing",
    stock: 25,
    price: 99.99
  }) {
    description
    id
    name
    price
    stock
  }
}
```

#### Actualizar producto
```graphql
mutation {
  updateProduct(
    updateProductInput: {
      id: "ef70186a-fbe3-494d-a0ca-883127dd7c2c"
      price: 12.63
      name: "New"
      stock: 6
    }
  ) {
    id
    description
    stock
    price
    name
  }
}

```

#### Eliminar producto
```graphql
mutation {
  removeProduct(
    removeProductInput: { id: "4b1601e4-8bbd-41d9-adf7-92ec0d9f1a40" }
  )
}

```

### Ejemplos de Backend (REST API)

Para entorno de desarrollo local:
```bash
curl -X GET http://localhost:3000/api/v1/product
```

#### Crear nuevo producto
```bash
curl -X POST http://localhost:3000/api/v1/product/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "another Kafka",
    "description": "This is kjust a test",
    "price": 85.63,
    "stock": 50
    }'
```

#### Actualizar producto
```bash
curl -X POST http://localhost:3000/api/v1/product/update \
  -H "Content-Type: application/json" \
  -d '{
    "id": "6d1b5636-21c8-4bd3-87e5-edc359ccd6a7",
    "name": "anotherone test",
    "description": "This is kjust a test",
    "price": 600.63,
    "stock": 1
}'
```



#### Eliminar producto
```bash
curl -X POST http://localhost:3000/api/v1/product/remove \
  -H "Content-Type: application/json" \
  -d '{"id":"2586a77d-7258-415d-887f-6862a671d8ce"}'
```

## Formatos de datos

### Backend REST API (Product DTO)
```json
{
    "id": "a8b301aa-6a81-4f03-b050-d890eb333d4f",
    "name": "New Kafka",
    "description": "This is kjust a test",
    "price": 85.63,
    "stock": 50
}
```

### BFF GraphQL API (Product DTO)
```json
{
    "id": "a8b301aa-6a81-4f03-b050-d890eb333d4f",
    "name": "New Kafka",
    "description": "This is kjust a test",
    "price": 85.63,
    "stock": 50
}
```
