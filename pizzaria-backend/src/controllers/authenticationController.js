require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ mensagem: 'Usuário não encontrado' });

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ mensagem: 'Senha incorreta' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({
      token,
      usuario: {
        id: user.id,
        email: user.email,
         nome: user.nome 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro no servidor' });
  }
};


// versão anterior
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// exports.login = async (req, res) => {
//   const { email, senha } = req.body;

//   try {
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) return res.status(401).json({ mensagem: 'Usuário não encontrado' });

//     const senhaCorreta = await bcrypt.compare(senha, user.senha);

//     if (!senhaCorreta) return res.status(401).json({ mensagem: 'Senha incorreta' });

//     const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN || '1d',
//     });

//     res.status(200).json({ token, usuario: { id: user.id, nome: user.nome, email: user.email } });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ mensagem: 'Erro no servidor' });
//   }
// };
