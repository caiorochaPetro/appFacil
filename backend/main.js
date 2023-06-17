import {ApolloServer} from '@apollo/server';
import {startStandaloneServer } from '@apollo/server/standalone';
import {Sequelize, DataTypes, where} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const connString = "postgres://postgres:0000@localhost:5432/appfacil";

const coonection = new Sequelize(connString);

coonection.authenticate()
.then(() => {
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
})
.catch((error) => {
  console.error('Erro ao conectar-se ao banco de dados:', error);
});

coonection.sync();
//models and relations
const user = coonection.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
    },
    telefone: {
      type: DataTypes.STRING(20),
    },
    sex: {
      type: DataTypes.STRING(10),
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user',
    timestamps: false,
  });

  const address = coonection.define('address', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'user',
        key: 'id'
      }
    },
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
      name: {
        singular: 'address',
        plural: 'address' // You can specify the plural form if needed
      },
    tableName: 'address',
    freezeTableName: true,
    underscored: false
  });


  const product = coonection.define('product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(255),
    },
    short_description: {
      type: DataTypes.STRING(255),
    },
    long_description: {
      type: DataTypes.TEXT,
    },
    imagens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    peso: {
      type: DataTypes.DECIMAL,
    },
    dimensoes: {
      type: DataTypes.STRING(255),
    },
    disponibilidade: {
      type: DataTypes.BOOLEAN,
    },
    cor: {
      type: DataTypes.STRING(255),
    },
    marca: {
      type: DataTypes.STRING(255),
    },
    categoria: {
      type: DataTypes.STRING(255),
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    createdAt:{
      type: DataTypes.DATE
    },
    updatedAt:{
      type: DataTypes.DATE
    },
  }, {
    name: {
      singular: 'product',
      plural: 'product' // You can specify the plural form if needed
    },
  tableName: 'product',
  freezeTableName: true,
  underscored: false
  });

//resolvers internals
async function seqUser(id) {
  const gUser = await user.findByPk(id,{
      include:[{
        model: address
      }],
  
  });
  return gUser;
};

async function seqProducts(){
  const gProduct = await product.findAll();

  return gProduct;
}

async function seqProduct(id){
  const gProduct = await product.findByPk(id);

  return gProduct;
}

async function seqUsers() {
  const gUser = await user.findAll({      
    include:[{
      model: address
    }]
  });
  return gUser;
};

async function seqEndereco(){
  const gAddress = await address.findAll();

  return gAddress
}

async function seqEnderecos(data){
  const gAddress = await address.create({
    data
  });

  return gAddress
}

export const resolvers = {
  Query: {
      async usuario(_,args){
          return await seqUser(args.id);       
      },
      async address(){
          return await seqEndereco();       
      },
      async usuarios(_,args){
        return await seqUsers(args.id);
      },
      async products(){
        return await seqProducts();
      },
      async product(_,args){
        return await seqProduct(args.id);
      }
  },
  Mutation:{
      async criarUsuario(_,args){
          return await seqCreateUser(args.input);       
      }
  }
}
// Definindo a associação
  

user.hasMany(address,{ foreignKey: 'userId' });
address.belongsTo(user, { foreignKey: 'userId' });
//schemas

export const typeDefs = `
type Usuario {
    id: ID!
    name: String!
    surname: String
    email: String!
    senha: String!
    birth_date: String
    telefone: String
    sex: String
    createdAt: String
    updatedAt: String
    address: [Address]
  }

  type Product {
    id: ID!
    nome: String
    short_description: String
    long_description: String
    imagens: [String]
    peso: Float
    dimensoes: String
    disponibilidade: Boolean
    cor: String
    marca: String
    categoria: String
    tags: [String]
    createdAt: String
    updatedAt: String
  }

  type Address {
    id: ID!
    userId: ID!
    street: String
    neighborhood: String!
    city: String!
    state: String!
    postal_code: String!
    country: String!
    createdAt: String!
    updatedAt: String!
  }
  
  input CreateAddressInput {
    userId: ID!
    street: String!
    neighborhood: String!
    city: String!
    state: String!
    postal_code: String!
    country: String!
  }

  type Query {
    usuario(id: ID!): Usuario
    usuarios: [Usuario]
    address: [Address]
    product(id: ID!): Product
    products: [Product]

  }
  
  type Mutation {
    criarUsuario(input: CriarUsuarioInput!): Usuario
    atualizarUsuario(id: ID!, input: AtualizarUsuarioInput!): Usuario
    deletarUsuario(id: ID!): Boolean
    createAddress(address: CreateAddressInput!): Address!
  }
  
  input CriarUsuarioInput {
    name: String!
    surname: String
    email: String!
    senha: String!
    birth_date: String
    telefone: String
    sex: String
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

  //server apollo instance

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const  apollo  = await startStandaloneServer(server, {
    listen: {port:4000}
}).then((({url})=>{console.log(`Hosted in ${url}`)}));

