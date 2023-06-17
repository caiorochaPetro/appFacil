import {gql} from 'apollo-server';
//user
export const typeDefs = `
type Usuario {
    id: ID!
    nome: String!
    sobrenome: String
    email: String!
    senha: String!
    dataNascimento: String
    telefone: String
    sexo: String
    dataCriacao: String
    dataAtualizacao: String
  }
  
  type Query {
    usuario(id: ID!): Usuario
    usuarios: [Usuario]
  }
  
  type Mutation {
    criarUsuario(input: CriarUsuarioInput!): Usuario
    atualizarUsuario(id: ID!, input: AtualizarUsuarioInput!): Usuario
    deletarUsuario(id: ID!): Boolean
  }
  
  input CriarUsuarioInput {
    nome: String!
    sobrenome: String
    email: String!
    senha: String!
    dataNascimento: String
    telefone: String
    sexo: String
  }
  
  input AtualizarUsuarioInput {
    nome: String
    sobrenome: String
    email: String
    senha: String
    dataNascimento: String
    telefone: String
    sexo: String
  }
  
`;