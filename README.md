# GraphQL Microservices Platform

A production-ready microservices architecture using GraphQL Federation, Node.js, Express, and MongoDB. The platform consists of an API Gateway that composes multiple independent subgraph services into a unified GraphQL API.

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│             Client (React)              │
└────────────────────┬────────────────────┘
                     │ GraphQL
                     ▼
┌─────────────────────────────────────────┐
│         Apollo Gateway (Port 4000)      │
│    (IntrospectAndCompose Federation)    │
└───────────────┬─────────────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌─────────────┐   ┌───────────────┐
│ Auth Service│   │Product Service│
│  (Port 4001)│   │  (Port 4002)  │
│  MongoDB    │   │  MongoDB      │
└─────────────┘   └───────────────┘
```

### Services

| Service | Port | Responsibility |
|---|---|---|
| **API Gateway** | `4000` | Federates subgraphs into a single schema via Apollo Gateway |
| **Auth Service** | `4001` | User registration, login, JWT issuance via HTTP-only cookies |
| **Product Service** | `4002` | Product catalog CRUD, protected by JWT authentication |

---

## Tech Stack

- **Runtime:** Node.js (ESM modules)
- **API Layer:** Apollo Server 4, Apollo Gateway (Federation v2), GraphQL
- **Web Framework:** Express
- **Database:** MongoDB via Mongoose
- **Auth:** JSON Web Tokens (JWT) + bcrypt password hashing
- **Tooling:** dotenv, nodemon, cookie-parser, CORS

---

## Prerequisites

- Node.js **v18+**
- MongoDB (local instance or a MongoDB Atlas connection string)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ricardo199/ADVANCED-MICROSERVICES-GRAPHQL-MICROSERVICES-EXAMPLE.git
cd ADVANCED-MICROSERVICES-GRAPHQL-MICROSERVICES-EXAMPLE
```

### 2. Configure environment variables

Each service reads its configuration from a `.env` file. Create one inside each service directory:

**`server/micro-services/auth-service/.env`**
```env
AUTH_MONGO_URI=mongodb://localhost:27017/authServiceDB
JWT_SECRET=your_super_secret_key
AUTH_PORT=4001
NODE_ENV=development
```

**`server/micro-services/product-service/.env`**
```env
DB_URI=mongodb://localhost:27017/product-service
JWT_SECRET=your_super_secret_key
PORT=4002
NODE_ENV=development
```

> ⚠️ Both services **must share the same `JWT_SECRET`** so tokens issued by the auth service can be verified by the product service.

### 3. Install dependencies and start services

Open three separate terminals:

**Auth Service**
```bash
cd server/micro-services/auth-service
npm install
npm run dev
```

**Product Service**
```bash
cd server/micro-services/product-service
npm install
npm run dev
```

**API Gateway**
```bash
cd server
npm install
npm run dev
```

The unified GraphQL API will be available at `http://localhost:4000/graphql`.

---

## GraphQL API

### Auth Service Operations

#### Register a new user
```graphql
mutation {
  register(username: "alice", password: "secret123")
}
```

#### Login
```graphql
mutation {
  login(username: "alice", password: "secret123")
}
```
A successful login sets an `httpOnly` JWT cookie (`token`) that is used to authenticate subsequent requests.

#### Get current user
```graphql
query {
  currentUser {
    username
  }
}
```

---

### Product Service Operations

> All product queries and mutations require an authenticated session (valid JWT cookie).

#### List all products
```graphql
query {
  products {
    id
    productName
    productDescription
  }
}
```

#### Add a product
```graphql
mutation {
  addProduct(
    productName: "Widget Pro"
    productDescription: "An advanced widget"
  ) {
    id
    productName
    productDescription
  }
}
```

---

## Project Structure

```
├── client/                          # Frontend (React — in progress)
└── server/
    ├── gateway.js                   # Apollo Gateway entry point
    ├── package.json
    └── micro-services/
        ├── auth-service/
        │   ├── auth-microservice.js # Service entry point
        │   ├── config/
        │   │   ├── config.js        # Environment config
        │   │   └── mongoose.js      # MongoDB connection
        │   ├── graphql/
        │   │   ├── typedef.js       # GraphQL type definitions
        │   │   └── resolvers.js     # Query / Mutation resolvers
        │   └── models/
        │       └── User.js          # Mongoose User model (bcrypt pre-save hook)
        └── product-service/
            ├── product-microservice.js
            ├── config/
            │   ├── config.js
            │   └── mongoose.js
            ├── graphql/
            │   ├── typeDefs.js
            │   └── resolvers.js
            └── models/
                └── Product.js
```

---

## Authentication Flow

1. Client calls the `login` mutation through the Gateway.
2. The Auth Service validates credentials, signs a JWT, and sets it as an `httpOnly` cookie on the response.
3. The browser automatically includes the cookie on subsequent requests to the Gateway.
4. Each subgraph's `expressMiddleware` context function reads the cookie, verifies the JWT, and attaches the decoded `user` object to the GraphQL context.
5. Protected resolvers (e.g., `products`, `addProduct`) inspect `context.user` and throw if it is absent.

---

## License

[ISC](LICENSE)
