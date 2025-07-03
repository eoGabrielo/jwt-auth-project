const mongoose = require('mongoose'); //Import mongoose para definir esquema e interagir.
const bcrypt = require('bcryptjs') //Import bcryptjs config senhas e criptografar.

//Schema do usuario pro MongoDB
const userSchema = new mongoose.Schema({
    userEmail:{
        type: String,
        required: true, //Campo obrigatorio
        unique: true //Bloqueia campo igual
    },
    userPassword:{
        type: String,
        required: true
    }
});

//Middleware: Função que "intercepta" as requisições antes que elas cheguem na rota final (ou depois que saem dela pro usuário), podendo modificar dados, verificar permissões, validar tokens e etc.

//Criação de MIDDLEWARE, ativada somente quando cria um usuario ou alterar senha de alguem -> '.pre('save') monitora.
userSchema.pre('save', async function (next) {
    if (this.isModified('userPassword')) {
        //Se a senha foi modificada ou é de um novo usuário, criptografa antes de salvar.
        const salt = await bcrypt.genSalt(10); // Gera salt.
        this.userPassword = await bcrypt.hash(this.userPassword, salt); // Criptografa senha.
        next(); // Continua caminho com o banco de dados para salvar/alterar.
    } else {
        // Se a senha não foi modificada, pula a criptografia.
        return next();
    }
});


//Exportar o Schema com Middleware, salt e hash
module.exports = mongoose.model('User', userSchema)
