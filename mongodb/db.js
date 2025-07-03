//Conexão com banco de dados USER

const mongoose = require('mongoose'); // Importa mongoose
const dotenv = require('dotenv'); // Importa o dotenv
dotenv.config(); // Carrega as variáveis do arquivo .env

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);// Conexão ao banco de dados MongoDB
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error.message);
    process.exit(1); // Encerra o processo em caso de falha
  }
};

module.exports = connectDB;
