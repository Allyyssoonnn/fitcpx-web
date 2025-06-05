import { useEffect, useState } from "react";
import { buscarCobrancaAluno } from "../../../api/pagamento";

function ExistPayment({ close, asaas_id }) {
    const [asaasPayment, setAsaasPayment] = useState(null);

    useEffect(() => {
        (async function load() {
            const cobranca = await buscarCobrancaAluno(asaas_id);
            if (cobranca) setAsaasPayment(cobranca);
        })();
    }, [asaas_id]);

    return (
        <div className="card" style={{ minHeight: '80vh' }}>
            <div className="card-body m-0">
                <h5 className="text-center">Realizar pagamento</h5>

                <div className="border border-bottom-3 border-gray m-1"></div>

                <a
                    href={asaasPayment?.invoiceUrl}
                    className="btn btn-info rounded w-100 mt-3"
                    target="_blank" // Se quiser abrir em nova aba
                    rel="noopener noreferrer" // Segurança ao usar target="_blank"
                >
                    Pagar agora
                </a>
            </div>

            <div className="card-footer d-flex justify-between">
                <button className='btn btn-danger rounded' onClick={close}>Fechar</button>
            </div>
        </div>
    )
}

export default ExistPayment;