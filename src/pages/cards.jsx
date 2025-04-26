import { useRecoilState } from "recoil";
import { stateAluno, useNotificacao } from "../states/states";
import { useQuery } from "react-query";
import { deleteCard, getCards } from "../api/aluno";
import { useMemo, useState } from "react";
import CardInput from "../components/CardInput";
import { createCardToken } from "../api/pagamento";

function Cards() {
    const { nConfirm } = useNotificacao();
    const [aluno] = useRecoilState(stateAluno);
    const [newCard, setNewCard] = useState(false);

    const { data: cards, refetch } = useQuery({
        queryKey: ['cards', aluno.cod_aluno],
        queryFn: () => getCards(aluno.cod_aluno),
        initialData: [],
        enabled: !!aluno.cod_aluno,
    });

    async function deletarCartao(cod_aluno_cartao) {
        nConfirm(null, 'Tem certeza que deseja deletar o cartão?', async () => {
            await deleteCard(cod_aluno_cartao);
            refetch();
            setNewCard(false);
        })
    }
    
    const createCard = () => setNewCard(!newCard);

    async function creatingCard(card) {
        const resp = await createCardToken(card, aluno.cod_empresa, aluno.cod_aluno);
        if (resp) refetch();
    }

    return (
        <div className="container-fluid">
            <button className={`btn btn-${!newCard ? 'success' : 'danger'} rounded w-100`} onClick={createCard}>{newCard ? 'Cancelar' : 'Cadastrar cartão'}</button>

            {!newCard && <CardList cards={cards} deleteCartao={deletarCartao} />}

            <div className="p-3">
                {newCard && <CardInput submit={creatingCard} submitText='Cadastrar Cartão' />}
            </div>
        </div>
    )
}

function CardList({ cards, deleteCartao }) {

    const memorizedCartoes = useMemo(() => {
        return cards?.map((cartao, index) => (
            <div key={index} className="card-item__side -front hover:scale-98 duration-1 cursor-pointer shadow-sm">
                <div className="card-item__cover">
                    <img
                        src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${Math.floor(Math.random() * 25 + 1)}.jpeg`}
                        className="card-item__bg"
                        alt="Card Background"
                    />
                </div>

                <div className="card-item__wrapper">
                    <div className="card-item__top">
                        <img
                            src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                            className="card-item__chip"
                        />
                        <div className="card-item__type">
                            <transition name="slide-fade-up">
                                <img
                                    src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cartao.bandeira_aluno_cartao}.png`}
                                    alt=""
                                    className="card-item__typeImg"
                                />
                            </transition>
                        </div>
                    </div>

                    <label htmlFor="cardNumber" className="card-item__number">
                        *** {cartao.final_aluno_cartao}
                    </label>

                    <div className="d-flex justify-content-end">
                        <button onClick={() => deleteCartao(cartao.cod_aluno_cartao)} className="btn btn-sm btn-danger rounded">
                            <i className="bi bi-trash me-2" />
                            Excluir
                        </button>

                        {/* <button onClick={() => selectCartao(cartao)} className="btn btn-success rounded">
                            <i className="bi bi-check-circle me-2" />
                            Selecionar
                        </button> */}
                    </div>
                </div>
            </div>
        ));
    }, [cards]);

    return (
        <div className="d-flex flex-column gap-2 mt-3">
            {memorizedCartoes}
        </div>
    )
}

export default Cards;