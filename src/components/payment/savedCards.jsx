import { useQuery } from "react-query";
import { getCards } from "../../api/aluno";

export default function SavedCards({ close, clientId, select }) {
    const { data: cards, refetch } = useQuery({
        queryKey: ['cards'],
        queryFn: () => getCards(clientId),
        enabled: !!clientId,
        initialData: [],
    });

    function selectCard(card) {
        select(card);
        close();
    }

    return (
        <div className="card">
            <div className="card-body">
                {cards.map((card, i) => (
                    <div className="card" key={i}>
                        <div className="card-body d-flex flex-col">
                            <h5>Cartão {i + 1}</h5>
                            <label>**** *** {card.final_aluno_cartao}</label>
                            <label>{card.expiracao_aluno_cartao}</label>
                            <button className="btn btn-sm btn-info mt-3"
                                onClick={() => selectCard(card)}
                            >Selecionar</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-footer d-flex justify-between">
                <button className="btn btn-danger rounded" onClick={close}>Cancelar</button>
                <button className="btn btn-success rounded">Selecionar</button>
            </div>
        </div>
    )
}