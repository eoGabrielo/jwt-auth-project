const express = require('express'); //Import express.
const app = express();
app.use(express.json()); //Habilitar uso de JSON nas requisições

const dotenv = require('dotenv'); //Import dotenv para ler as variaveis do arquivo .env
dotenv.config(); //Carrega as variaveis do .env

const authRoutes = require('./routes/authRoutes') //Import rotas.

const connectDB = require('./mongodb/db');//Import conexão com banco de dados.
connectDB(); //Realiza Conexão com banco de dados

const PORT = process.env.PORT || 3000; //Porta servidor

app.use('/auth', authRoutes); //Usa rotas de autenticação com prefixo '/auth'

app.get('/index.html', (req, res) => { //Rota Raiz.
    res.send('API de autenticação com JWT funcionando');
})

app.listen(PORT, () =>{ //Ouvir o servidor quando iniciar.
    console.log('Servidor rodando em http://localhost:' + PORT)
})



const path = require('path');//Import p/ ajudar a montar o caminho correto para a pasta public.
app.use(express.static(path.join(__dirname, 'public')));// Middleware do Express que entrega os arquivos dessa pasta quando você acessa pelo navegador.
//Ao acessar http://localhost:3000/index.html, o Express vai procurar esse arquivo dentro da pasta public e entregar para o navegador.
