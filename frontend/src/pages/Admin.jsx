import { useState } from "react";

import AdminCategorias from "../components/admin/AdminCategorias";
import AdminInteresses from "../components/admin/AdminInteresses";
import AdminLugares from "../components/admin/AdminLugares";

const ABAS = [
    { id: "lugares", rotulo: "Lugares" },
    { id: "categorias", rotulo: "Categorias" },
    { id: "interesses", rotulo: "Interesses" },
];

// Área administrativa: só aparece para role ADMIN (RotaPrivada somenteAdmin).
// O backend também bloqueia (403) quem não for ADMIN.
function Admin() {
    const [aba, setAba] = useState("lugares");

    return (
        <div className="container pagina">
            <header className="pagina-cabecalho">
                <h1>Administração</h1>
                <p>Cadastre e mantenha lugares, categorias e interesses.</p>
            </header>

            <div className="abas" role="tablist" aria-label="Seções da administração">
                {ABAS.map((a) => (
                    <button
                        key={a.id}
                        type="button"
                        role="tab"
                        id={`aba-${a.id}`}
                        aria-selected={aba === a.id}
                        aria-controls={`painel-${a.id}`}
                        className={`aba ${aba === a.id ? "aba-ativa" : ""}`.trim()}
                        onClick={() => setAba(a.id)}
                    >
                        {a.rotulo}
                    </button>
                ))}
            </div>

            <div role="tabpanel" id={`painel-${aba}`} aria-labelledby={`aba-${aba}`}>
                {aba === "lugares" && <AdminLugares />}
                {aba === "categorias" && <AdminCategorias />}
                {aba === "interesses" && <AdminInteresses />}
            </div>
        </div>
    );
}

export default Admin;
