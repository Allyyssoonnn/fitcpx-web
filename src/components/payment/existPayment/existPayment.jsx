import { useEffect, useState } from "react";
import { buscarCobrancaAluno, pagarCobranca } from "../../../api/pagamento";
import SavedCards from "../savedCards";
import { useNotificacao } from "../../../states/states";

function ExistPayment({ close, asaas_id, clientId }) {
    const { nLoading, endLoading } = useNotificacao();
    const [asaasPayment, setAsaasPayment] = useState(null);
    const [savedCards, setSavedCards] = useState(false);

    useEffect(() => {
        (async function load() {
            const cobranca = await buscarCobrancaAluno(asaas_id);
            if (cobranca) setAsaasPayment(cobranca);
        })();
    }, [asaas_id]);

    async function onPayCard(card) {
        nLoading();
        await pagarCobranca(asaas_id, card?.cod_aluno_cartao);
        endLoading();
        close();
    }

    if (savedCards) return (
        <SavedCards
            select={(card) => onPayCard(card)}
            close={() => setSavedCards(false)}
            clientId={clientId}
        />
    )

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
                    <i className="bi bi-arrow-right me-1" />
                    Pagar agora
                </a>

                <button className="btn btn-warning rounded w-100 mt-3"
                    onClick={() => setSavedCards(true)}
                >
                    <i className="bi bi-credit-card me-1" />
                    Pagar com cartão salvo
                </button>
            </div>

            <div className="card-footer d-flex justify-between">
                <button className='btn btn-danger rounded' onClick={close}>Fechar</button>
            </div>
        </div>
    )
}

export default ExistPayment;