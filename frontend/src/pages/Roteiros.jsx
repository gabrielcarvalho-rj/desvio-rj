import { Link } from "react-router-dom";

import { Carregando, Erro, Vazio } from "../components/Estados";
import Icone from "../components/Icone";
import { useAuth } from "../context/AuthContext";
import useApi from "../hooks/useApi";
import { formatarData } from "../utils/formatar";

function Roteiros() {
    const { usuario } = useAuth();
    const { dados, carregando, erro, recarregar } = useApi(`/roteiros/usuario/${usuario.id}`);

    return (
        <div className="container pagina">
            <header className="pagina-cabecalho pagina-cabecalho-acao">
                <div>
                    <h1>Meus roteiros</h1>
                    <p>Organize os lugares que você quer visitar, com horário e observações.</p>
                </div>

                <Link to="/roteiros/criar" className="botao botao-primario">
                    <Icone nome="mais" tamanho={18} />
                    Novo roteiro
                </Link>
            </header>

            {carregando && !dados && <Carregando texto="Carregando roteiros..." />}
            {erro && <Erro mensagem={erro} aoTentarDeNovo={recarregar} />}

            {dados && dados.length === 0 && (
                <Vazio titulo="Você ainda não criou nenhum roteiro">
                    <Link to="/roteiros/criar" className="botao botao-primario">
                        Criar primeiro roteiro
                    </Link>
                </Vazio>
            )}

            {dados && dados.length > 0 && (
                <ul className="roteiros-lista">
                    {dados.map((roteiro) => (
                        <li key={roteiro.id}>
                            <Link to={`/roteiros/${roteiro.id}`} className="roteiro-card">
                                <div>
                                    <h2>{roteiro.titulo}</h2>
                                    {roteiro.descricao && <p>{roteiro.descricao}</p>}
                                </div>

                                <p className="roteiro-meta">
                                    <span>
                                        <Icone nome={roteiro.publico ? "mundo" : "cadeado"} tamanho={16} />
                                        {roteiro.publico ? "Público" : "Privado"}
                                    </span>
                                    {roteiro.criadoEm && <span>Criado em {formatarData(roteiro.criadoEm)}</span>}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Roteiros;
