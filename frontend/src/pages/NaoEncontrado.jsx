import { Link } from "react-router-dom";

function NaoEncontrado() {
    return (
        <div className="container pagina pagina-centro">
            <h1>Página não encontrada</h1>
            <p>O endereço que você abriu não existe ou foi movido.</p>
            <Link to="/" className="botao botao-primario">
                Voltar ao início
            </Link>
        </div>
    );
}

export default NaoEncontrado;
