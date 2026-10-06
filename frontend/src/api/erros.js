// Transforma um erro do Axios em uma mensagem legível para o usuário.
// O backend responde erros em JSON com os campos "mensagem" e "message".
export function mensagemErro(erro, padrao = "Algo deu errado. Tente novamente.") {
    if (!erro.response) {
        return "Não foi possível falar com o servidor. Confira se o backend está rodando em http://localhost:8080.";
    }

    const { status, data } = erro.response;
    const texto = data?.mensagem || data?.message;

    if (texto) {
        return texto;
    }

    if (status === 403) return "Você não tem permissão para fazer isso.";
    if (status === 401) return "Sua sessão expirou. Entre novamente.";
    if (status === 404) return "Não encontramos o que você procurou.";
    if (status >= 500) return "O servidor encontrou um problema. Tente de novo em instantes.";

    return padrao;
}
