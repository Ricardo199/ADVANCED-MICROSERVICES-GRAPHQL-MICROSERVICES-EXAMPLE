const typeDefs = `#graphql
    type Product {
        id: ID!
        productName: String!
        productDescription: String!
    }

    type Query {
        products: [Product!]!
    }

    type Mutation {
        addProduct(productName: String!, productDescription: String!): Product!
    }
`;

export default typeDefs;