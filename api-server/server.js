const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-ctr';
let secretKey = process.env.SECRET_KEY || 'myverystrongsecretkey';

// Ensure the secret key is 32 bytes long
secretKey = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);

const decrypt = (hash) => {
  const [iv, encrypted] = hash.split(':');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);

  return decrypted.toString();
};

const startServer = async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const encryptedMongoUri = process.env.ENCRYPTED_MONGO_URI;
  const mongoUri = decrypt(encryptedMongoUri);

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/graphql');
  });
};

startServer();
