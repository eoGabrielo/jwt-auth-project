const User = require('../models/User'); //Import modelo User para interagir com MongoDB.

const bcrypt = require('bcryptjs'); //Comparar criptografia e senhas.
const jwt = require('jsonwebtoken'); //Import jsonwebtoken para gerar tokens JWT.

//Função para cadastrar novo usuário.
exports.register = async (req, res) => { //exports.register -> função 'register' que ja está sendo exportada.
    try {
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;

        //Verificar se o email ja existe.
        //'findOne' faz buscas no banco de dados por objeto, podendo passar mais de um valor, ele vai retornar se for exatamente igual.
        const existingUser = await User.findOne({userEmail});
        if(existingUser){
            return res.status(400).json({ message: 'Usuário já existe' });
        }else{//Se o usuario não existir no banco de dados, vamos criar ele com Schema(User) e mandar pro MongoDB gerando seu token JWT.
            const user = new User ({ userEmail, userPassword }); //Cria umdocumento baseado no Schema MongoDB. (Essa parte gera um '_id' automaticamente para o usuario.)
            await user.save(); //Enviar para o banco de dados, como temos um middleware, esse '.save' ativa ele, aonde faz a criptografia da senha './models/User.js', para depois terminar de enviar os dados.

            //Com o usuario criado, criamos o 'token' com base no seu '_id'.
            //Token JWT é criado usando o user._id como 'payload' e a chave secreta na variavel 'JWT_SECRET' no arquivo '.env'
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {//AONDE ELE PEGA ESSE IDUSER
                expiresIn: '1h'
            });

            //Retorna do servidor sucesso e token
            res.status(201).json({ message: 'Usuário criado com sucesso ', token })
        }
    }catch(error){//Captura erro
        console.error('Erro no register:', error); // Loga erro completo
  res.status(500).json({ message: 'Erro no servidor', erro: error.message });
    };
};

//Função login do usuário
exports.login = async (req, res) => {
    try{
        const userEmail = req.body.userEmail;
        const userPassword = req.body.userPassword;

        //Busca o usuário pelo email.
        const user = await User.findOne({userEmail})
        if(user){//Usuário encontrado.
            const isMatch = await bcrypt.compare(userPassword, user.userPassword)//Compara a senha que foi enviada pro req.body com a do banco de dados
            if(isMatch){
                //Senha Correta
                const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
                    expiresIn: '1h'
                });
                res.status(200).json({message: 'Login realizado com sucesso ', token})
            }else{
                //Senha Errada
                return res.status(400).json({message: 'Senha invalida'})
            }
        }else{//Usuário não existe.
            return res.status(400).json({message:  'Usuário não encontrado'})
        }
    }catch(error){
        res.status(500).json({message: 'Erro servidor ', error: error.message});
    };
};

//Função para verificar token se existe e esta valido.
exports.check = async (req, res)=> {
    const token = req.headers.authorization?.split(' ')[1]; // Pega o token do cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica validade
    res.status(200).json({ valid: true, userId: decoded.id });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Token inválido ou expirado' });
  }
}