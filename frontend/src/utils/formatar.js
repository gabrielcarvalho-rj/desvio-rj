export function formatarPreco(lugar) {
    if (lugar.gratuito) return "Gratuito";

    if (lugar.precoInicial > 0) {
        return `A partir de ${lugar.precoInicial.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })}`;
    }

    return "Preço não informado";
}

export function formatarDuracao(minutos) {
    if (!minutos || minutos <= 0) return null;
    if (minutos < 60) return `${minutos} min`;

    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;

    return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`;
}

export function formatarData(texto) {
    if (!texto) return "";

    const data = new Date(texto);
    if (Number.isNaN(data.getTime())) return "";

    return data.toLocaleDateString("pt-BR");
}

// LugarResponse devolve categoria como objeto { id, nome };
// LugarResumoResponse (favoritos, itens do roteiro) devolve só o nome.
export function nomeCategoria(lugar) {
    if (!lugar.categoria) return "";
    return typeof lugar.categoria === "string" ? lugar.categoria : lugar.categoria.nome;
}
