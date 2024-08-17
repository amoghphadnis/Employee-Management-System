const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const algorithm = 'aes-256-ctr';
let secretKey = process.env.SECRET_KEY || 'myverystrongsecretkey';

// Ensure the secret key is 32 bytes long
secretKey = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);

const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

const mongoUri = process.env.MONGO_URI;
const encryptedUri = encrypt(mongoUri);

// Write the encrypted URI to the .env file
fs.writeFileSync('.env', `ENCRYPTED_MONGO_URI=${encryptedUri}\n`, { flag: 'a' });

console.log('Encrypted Mongo URI:', encryptedUri);
