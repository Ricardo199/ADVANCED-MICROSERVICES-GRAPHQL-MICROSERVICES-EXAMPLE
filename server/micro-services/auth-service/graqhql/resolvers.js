import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';

const resolvers = {
    Query: {
        currentUser: (_, __, context) => {
            const { req } = context;

            if (!req || !req.cookies) {
                return null;
            }
            const token = req.cookies['token'];
            if (!token) {
                return null;
            }
            try {
                const decoded = jwt.verify(token, config.JWT_SECRET);
                return { username: decoded.username };
            } catch (err) {
                return null;
            }
        },
    },

    Mutation: {
        login: async (_, { username, password }, { res }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('User not found');
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ username }, config.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            console.log("✅ Cookie set in response:", res.getHeaders()['set-cookie']);

            console.log("✅ Cookie set:", res.getHeaders()['set-cookie']);

            return true;
        },

        register: async (_, { username, password }) => {
            const existingUser = await User.findOne({ username });
            if(existingUser) {
                throw new Error('Username is already taken');
            }
            const newUser = new User({ username, password:password });
            await newUser.save();
            return true;
        },
    },
};

export default resolvers;