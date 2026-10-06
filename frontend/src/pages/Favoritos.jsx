import { Link } from "react-router-dom";

import { Carregando, Erro, Vazio } from "../components/Estados";
import LugarCard from "../components/LugarCard";
import useFavoritos from "../hooks/useFavoritos";

function Favoritos() {
    const { favoritos, carregando, erro, alternar } = useFavoritos();

    return (
        <div className="container pagina">
            <header className="pagina-cabecalho">
                <h1>Favoritos</h1>
                <p>Os lugares que você salvou para visitar depois.</p>
            </header>

            {carregando && favoritos.length === 0 && <Carregando texto="Carregando favoritos..." />}
            {erro && <Erro mensagem={erro} />}

            {!carregando && !erro && favoritos.length === 0 && (
                <Vazio titulo="Você ainda não salvou nenhum lugar">
                    <Link to="/lugares" className="botao botao-primario">
                        Explorar lugares
                    </Link>
                </Vazio>
            )}

            {favoritos.length > 0 && (
                <div className="grade-lugares">
                    {favoritos.map((favorito) => (
                        <LugarCard
                            key={favorito.id}
                            lugar={favorito.lugar}
                            favorito
                            aoFavoritar={alternar}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favoritos;
