const User = require('../models/User'); //Import modelo User para interagir com MongoDB.
const bcrypt = require('bcryptjs'); //Comparar criptografia e senhas.
const jwt = require('jsonwebtoken'); //Import jsonwebtoken para gerar tokens JWT.

//Função para cadastrar novo usuário.
exports.register = async (req, res) => { //exports.register -> função 'register' que ja está sendo exportada.
    try {
        const email = req.body.email;
        const password = req.body.password;

        //Verificar se o email ja existe.
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: 'Usuário já existe' });
        }else{//Se o usuario não existir no banco de dados, vamos criar ele com Schema(User) e mandar pro MongoDB gerando seu token JWT.
            const user = new User ({ email, password }); //Cria umdocumento baseado no Schema MongoDB. (Essa parte gera um '_id' automaticamente para o usuario.)
            await user.save(); //Enviar para o banco de dados, como temos um middleware, esse '.save' ativa ele, aonde faz a criptografia da senha './models/User.js', para depois terminar de enviar os dados.

            //Com o usuario criado, criamos o 'token' com base no seu '_id'.
            //Token JWT é criado usando o user._id como 'payload'.
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {//AONDE ELE PEGA ESSE IDUSER
                expiresIn: '1h'
            });

            //Retorna sucesso e token
            res.status(201).json({ message: 'Usuário criado com sucesso ', token })
        }
    }catch(error){//Captura erro
        res.status(500).json({ message: 'Erro no servidor', erro: error.message });
    };
};

//Função login do usuário
exports.login = async (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        //Busca o usuário pelo email.
        const user = await User.findOne({email})
        if(user){//Usuário encontrado.
            const isMatch = await bcrypt.compare(password, user.password)//Compara a senha que foi enviada pro req.body com a do banco de dados
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
