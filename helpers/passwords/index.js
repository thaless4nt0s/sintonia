/* REQUIRES --- */

const bcrypt = require('bcrypt')

/* --- METHODS --- */

// Função para criptografar a senha
async function criptografarSenha (senha) {
  try {
    // Gerar um salt (um valor aleatório usado durante a criptografia)
    const salt = await bcrypt.genSalt(10) // 10 é o número de rounds de hash (quanto maior, mais seguro, mas também mais lento)

    // Criptografar a senha com o salt
    const senhaCriptografada = await bcrypt.hash(senha, salt)

    return senhaCriptografada
  } catch (error) {
    throw new Error('Erro ao criptografar a senha')
  }
}

// Função para verificar se a senha fornecida corresponde à senha criptografada
async function verificarSenha (senhaDigitada, senhaCriptografada) {
  try {
    // Comparar a senha digitada com a senha criptografada
    const correspondencia = await bcrypt.compare(senhaDigitada, senhaCriptografada)

    return correspondencia
  } catch (error) {
    throw new Error('Erro ao verificar a senha')
  }
}

module.exports = {
  criptografarSenha,
  verificarSenha
}
