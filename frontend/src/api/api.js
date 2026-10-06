import axios from "axios";

// Chaves usadas no localStorage (sessão do usuário)
export const CHAVE_TOKEN = "token";
export const CHAVE_USUARIO = "usuario";

// Evento disparado quando o servidor recusa um token (401).
// O AuthProvider escuta e encerra a sessão.
export const EVENTO_SESSAO_EXPIRADA = "desviorj:sessao-expirada";

// Instância única do Axios usada por toda a aplicação.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Antes de cada requisição: se houver token, envia "Authorization: Bearer <token>".
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(CHAVE_TOKEN);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Depois de cada resposta: 401 com token guardado significa sessão inválida ou expirada.
api.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
        const status = erro.response?.status;
        const tinhaToken = !!localStorage.getItem(CHAVE_TOKEN);

        if (status === 401 && tinhaToken) {
            window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
        }

        return Promise.reject(erro);
    }
);

export default api;
