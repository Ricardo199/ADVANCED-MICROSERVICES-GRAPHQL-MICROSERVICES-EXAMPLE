import dotenv from 'dotenv';
dotenv.config();

import { parse } from 'graphql';
import { config } from './config/config.js';
import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSchema } from '@apollo/subgraph';

import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyparser from 'body-parser';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

console.log("🔍 JWT_SECRET in service:", process.env.JWT_SECRET);

connectDB();

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000', 'https://studio.apollographql.com'],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

const schema = buildSubgraphSchema([{ typeDefs: parse(typeDefs), resolvers }]);

const server = new ApolloServer({
    schema,
    introspection: true,
});

async function startServer() {
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req, res }) => {
            console.log("Auth Microservice: Checking request cookies:", req.cookies);
            const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
            let user = null;
            if (token) {
                try {
                    decoded = jwt.verify(token, config.JWT_SECRET);
                    user = { username: decoded.username };
                    console.log("✅ Authenticated User:", user);
                } catch (error) {
                    console.error("🚨 Token verification failed:", error)
                }
            }
            return {};
        }
    }));
    app.listen(config.PORT, () => {
        console.log(`🚀 Auth Service running running at http://localhost: ${config.PORT}/graphql`);
    });
}

startServer();