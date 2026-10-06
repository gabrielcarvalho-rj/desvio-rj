// Fotos locais ficam em public/imagens. O backend devolve fotoUrl como caminho local
// (ex.: "/imagens/praia-ipanema.webp") ou como endereço http/https. Ordem de escolha:
//   1. fotoUrl local (começa com "/")
//   2. foto local reconhecida pelo nome do lugar (fallback para bancos antigos)
//   3. foto local reconhecida pelo id (lugares originais 1, 2, 3 e 5)
//   4. fotoUrl http/https vindo do backend
//   5. nada: o componente mostra um fallback visual

const POR_NOME = [
    ["grumari", "/imagens/Praia-grumari.jpeg"],
    ["pedra bonita", "/imagens/Pedra-bonita.jpg"],
    ["museu do amanha", "/imagens/Museu-do-amanha.webp"],
    ["parque lage", "/imagens/Parque_lage_rio_de_janeiro.jpg"],
];

const POR_ID = {
    1: "/imagens/Praia-grumari.jpeg",
    2: "/imagens/Pedra-bonita.jpg",
    3: "/imagens/Museu-do-amanha.webp",
    5: "/imagens/Parque_lage_rio_de_janeiro.jpg",
};

function normalizar(texto) {
    return (texto || "")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[_-]/g, " ")
        .toLowerCase();
}

export function obterImagemLugar(lugar) {
    if (!lugar) return null;

    // Caminho local ("/imagens/..."), sem aceitar "//host" (endereço de outro site).
    if (lugar.fotoUrl && /^\/(?!\/)/.test(lugar.fotoUrl)) {
        return lugar.fotoUrl;
    }

    const nome = normalizar(lugar.nome);
    const achado = POR_NOME.find(([trecho]) => nome.includes(trecho));
    if (achado) return achado[1];

    if (POR_ID[lugar.id]) return POR_ID[lugar.id];

    if (lugar.fotoUrl && /^https?:\/\//i.test(lugar.fotoUrl)) {
        return lugar.fotoUrl;
    }

    return null;
}

// Imagem usada no hero da Home.
export const IMAGEM_HERO = "/imagens/hero-rio.png";
