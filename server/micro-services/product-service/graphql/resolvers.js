import Product from '../models/product.model';

const resolvers = {
    Query: {
        products: async (_, __, { user }) => {
            if (!user) throw new Error('You must be logged in');
            return await Product.find({});
        },
    },
    Mutation: {
        addProduct: async (_, { productName, productDescription }, { user }) => {
            if (!user) throw new Error('You must be logged in');
            const newProduct = new Product({ productName, productDescription });
            await newProduct.save();
            return newProduct;
        }
    },
};

export default resolvers;