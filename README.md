# GraphQL Microservices Architecture

A full-stack, federated GraphQL API built with **Apollo Federation**, **Node.js**, and **MongoDB**. The system is composed of independent microservices unified under a single API Gateway, demonstrating authentication, authorization, and domain-driven service separation.

---

## Architecture Overview

```
Client
  │
  ▼
Apollo Gateway  (port 4000)
  ├── Auth Service     (port 4001)  — User registration & JWT authentication
  └── Product Service  (port 4002)  — Product management (protected)
```

Each microservice owns its own MongoDB database, exposes a GraphQL subgraph schema, and is stitched together at runtime by the Apollo Gateway via **schema introspection and composition**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| API Gateway | Apollo Gateway (`@apollo/gateway`) |
| Microservices | Apollo Server 4 (`@apollo/server`) + Apollo Subgraph |
| Federation | Apollo Federation v2 (`@apollo/subgraph`) |
| Runtime | Node.js (ESM modules) |
| Web Framework | Express |
| Database | MongoDB via Mongoose |
| Authentication | JSON Web Tokens (`jsonwebtoken`) + bcrypt |
| Session | HTTP-only cookies (`cookie-parser`) |
| Environment | dotenv |
| Dev Server | nodemon |

---

## Services

### Auth Service — `server/micro-services/auth-service`

Handles all identity and access management.

| Operation | Type | Description |
|---|---|---|
| `register(username, password)` | Mutation | Create a new user account |
| `login(username, password)` | Mutation | Authenticate and set a signed JWT cookie |
| `currentUser` | Query | Return the currently authenticated user |

- Passwords are hashed with **bcrypt** (10 salt rounds) before persistence.
- Successful login sets an `httpOnly` cookie containing a signed JWT (1-day expiry).
- Connects to its own MongoDB database (`authServiceDB`).

---

### Product Service — `server/micro-services/product-service`

Manages the product catalog. All operations require a valid authenticated session.

| Operation | Type | Description |
|---|---|---|
| `products` | Query | Retrieve all products |
| `addProduct(productName, productDescription)` | Mutation | Create a new product |

- Validates the JWT from the cookie on every request via the gateway context.
- Connects to its own MongoDB database.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

### Environment Variables

Create a `.env` file in each service directory.

**Auth Service** (`server/micro-services/auth-service/.env`):
```env
AUTH_MONGO_URI=mongodb://localhost:27017/authServiceDB
JWT_SECRET=your_super_secret_key
AUTH_PORT=4001
```

**Product Service** (`server/micro-services/product-service/.env`):
```env
PRODUCT_MONGO_URI=mongodb://localhost:27017/productServiceDB
JWT_SECRET=your_super_secret_key
PRODUCT_PORT=4002
```

> ⚠️ **Important:** `JWT_SECRET` must be identical across all services so the gateway can validate tokens issued by the auth service.

### Installation & Running

Start each service independently in its own terminal.

**1. Auth Service**
```bash
cd server/micro-services/auth-service
npm install
npm run dev
# Running at http://localhost:4001/graphql
```

**2. Product Service**
```bash
cd server/micro-services/product-service
npm install
npm run dev
# Running at http://localhost:4002/graphql
```

**3. API Gateway**
```bash
cd server
npm install
npm run dev
# Gateway running at http://localhost:4000/graphql
```

All client requests should target the **Gateway** at `http://localhost:4000/graphql`.

---

## Example GraphQL Operations

### Register a user
```graphql
mutation {
  register(username: "alice", password: "securepassword")
}
```

### Log in
```graphql
mutation {
  login(username: "alice", password: "securepassword")
}
```

### Fetch products (requires authentication)
```graphql
query {
  products {
    id
    productName
    productDescription
  }
}
```

### Add a product (requires authentication)
```graphql
mutation {
  addProduct(
    productName: "Widget Pro"
    productDescription: "A high-quality widget for professionals."
  ) {
    id
    productName
  }
}
```

---

## Project Structure

```
├── client/                          # Frontend application (in development)
└── server/
    ├── gateway.js                   # Apollo Federation Gateway
    └── micro-services/
        ├── auth-service/
        │   ├── config/
        │   │   ├── config.js        # Environment configuration
        │   │   └── mongoose.js      # Database connection
        │   ├── graphql/
        │   │   ├── typedef.js       # GraphQL schema (User, Auth mutations)
        │   │   └── resolvers.js     # Query & mutation resolvers
        │   ├── models/
        │   │   └── User.js          # Mongoose User model
        │   └── auth-microservice.js # Service entry point
        └── product-service/
            ├── config/
            │   ├── config.js        # Environment configuration
            │   └── mongoose.js      # Database connection
            ├── graphql/
            │   ├── typeDefs.js      # GraphQL schema (Product type & operations)
            │   └── resolvers.js     # Query & mutation resolvers
            ├── models/
            │   └── Product.js       # Mongoose Product model
            └── product-microservice.js # Service entry point
```

---

## License

This project is licensed under the terms of the [LICENSE](./LICENSE) file included in this repository.
