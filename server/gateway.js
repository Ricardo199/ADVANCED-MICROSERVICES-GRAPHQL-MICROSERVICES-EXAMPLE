import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import {apolloServer} from 'apollo-server-express';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloGateway, IntrospectAndCompose} from '@apollo/gateway';
import cors from 'cors';
import cookyParser from 'cookie-parser'

const app = express();

app.use(express.json());
