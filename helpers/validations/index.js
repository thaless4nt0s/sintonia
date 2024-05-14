/* --- CONSTS --- */

const DOMINIO_ALUNO_IFCE = /@aluno\.ifce\.edu\.br$/

/* --- METHODS --- */

exports.validateEmailInstitucionalDeAlunoOuTutor = (email) =>{
  // Verifica se o email é uma string
  if (typeof email !== 'string') {
    return false
  }

  // Verifica se o email tem o formato correto
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return false // O email não tem o formato correto
  }

  // Verifica se o email contém o domínio correto
  if (!DOMINIO_ALUNO_IFCE.test(email)) {
      return false // O email não contém o domínio correto
  }

  return true // O email é válido
}
