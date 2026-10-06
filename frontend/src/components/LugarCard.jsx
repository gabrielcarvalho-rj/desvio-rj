import { Link } from "react-router-dom";

import { formatarDuracao, formatarPreco, nomeCategoria } from "../utils/formatar";
import Icone from "./Icone";
import ImagemLugar from "./ImagemLugar";

// Cartão de lugar. Funciona com LugarResponse e LugarResumoResponse.
//   favorito: true/false  |  aoFavoritar: função (se omitida, o botão não aparece)
function LugarCard({ lugar, favorito = false, aoFavoritar, destaque = false }) {
    const categoria = nomeCategoria(lugar);
    const duracao = formatarDuracao(lugar.duracaoMinutos);

    return (
        <article className={`lugar-card ${destaque ? "lugar-card-destaque" : ""}`.trim()}>
            <Link to={`/lugares/${lugar.id}`} className="lugar-card-link">
                <div className="lugar-card-foto">
                    <ImagemLugar lugar={lugar} />
                </div>

                <div className="lugar-card-corpo">
                    {categoria && <span className="lugar-card-categoria">{categoria}</span>}

                    <h3>{lugar.nome}</h3>

                    {lugar.bairro && (
                        <p className="lugar-card-local">
                            <Icone nome="pin" tamanho={15} />
                            {lugar.bairro}
                        </p>
                    )}

                    <p className="lugar-card-dados">
                        <span>{formatarPreco(lugar)}</span>
                        {duracao && <span>{duracao}</span>}
                    </p>
                </div>
            </Link>

            {aoFavoritar && (
                <button
                    type="button"
                    className={`favoritar ${favorito ? "favoritar-ativo" : ""}`.trim()}
                    onClick={() => aoFavoritar(lugar.id)}
                    aria-pressed={favorito}
                    aria-label={
                        favorito
                            ? `Remover ${lugar.nome} dos favoritos`
                            : `Salvar ${lugar.nome} nos favoritos`
                    }
                >
                    <Icone nome="coracao" tamanho={20} preenchido={favorito} />
                </button>
            )}
        </article>
    );
}

export default LugarCard;
