const typeDefs = `#graphql
    type User {
        username: String!
    }
    
    type Query{
        currentUser: User
    }

    type Mutation{
        login(username: String!, password: String!): Boolean
        register(username: String!, password: String!): Boolean
    }
  
`;

module.exports = typeDefs;