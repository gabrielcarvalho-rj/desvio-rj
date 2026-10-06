import { useState } from "react";

import { obterImagemLugar } from "../utils/imagens";

// Foto do lugar com fallback elegante quando não existe ou falha ao carregar.
function ImagemLugar({ lugar, className = "" }) {
    const src = obterImagemLugar(lugar);
    const [srcQuebrada, setSrcQuebrada] = useState(null);

    if (src && src !== srcQuebrada) {
        return (
            <img
                className={`imagem-lugar ${className}`.trim()}
                src={src}
                alt={lugar.nome}
                loading="lazy"
                decoding="async"
                onError={() => setSrcQuebrada(src)}
            />
        );
    }

    return (
        <div
            className={`imagem-lugar imagem-vazia ${className}`.trim()}
            role="img"
            aria-label={`${lugar.nome} (sem foto)`}
        >
            <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
                <path d="M0 100V70c18-6 30-30 46-30 14 0 18 14 30 14 16 0 22-34 40-34 14 0 20 22 34 22 12 0 18-10 28-10 10 0 16 8 22 12v56H0Z" />
            </svg>
        </div>
    );
}

export default ImagemLugar;
