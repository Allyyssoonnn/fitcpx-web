import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { stateEmpresa, useNotificacao } from "../../states/states";
import { loadStripe } from '@stripe/stripe-js';
import { PRODUCAO } from "../../api/api";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useRecoilState } from "recoil";
import PagamentoInterno from "./newPayment";
import PagamentoIntent from "./existPayment";

function Pagamento({ show, close, onPay, callback, client, payment, licenca, atSigth }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const [stripePromise, setStripePromise] = useState(null);

    useEffect(() => {
        if (licenca) {
            const promise = loadStripe(
                PRODUCAO
                    ? 'pk_live_51RKPzOBL0IrftB8edwNRflZ54s2UiIXnwufH4eU1pUV5IW2Dsr914qMWPtS5lSQQZuyA9qP4ekf13PpWxiqNsk2a00y5QIWyjU'
                    : 'pk_test_51RKPzXPd9Pbt6nSARyfESdEWakvQyqlfBS9jdNvKlxPN9u6F8kcx5mISolo9eIzZkKLLt0iVEKm8Ikl0Hg5cfDDv00dG7f25k2',
            );
            setStripePromise(promise);
        } else {
            const accountId = PRODUCAO ? empresa?.stripe_id : empresa?.dev_stripe_id;
            
            if (!accountId) {
                // toast.error('Preencher formulário para FitCpx Pay.');
                return;
            }
            const promise = loadStripe(
                PRODUCAO
                    ? 'pk_live_51RKPzOBL0IrftB8edwNRflZ54s2UiIXnwufH4eU1pUV5IW2Dsr914qMWPtS5lSQQZuyA9qP4ekf13PpWxiqNsk2a00y5QIWyjU'
                    : 'pk_test_51RKPzXPd9Pbt6nSARyfESdEWakvQyqlfBS9jdNvKlxPN9u6F8kcx5mISolo9eIzZkKLLt0iVEKm8Ikl0Hg5cfDDv00dG7f25k2',
                { stripeAccount: accountId }
            );
            setStripePromise(promise);
        }
    }, [empresa]);

    return (
        <Modal show={show} size="md">
            <Elements stripe={stripePromise}>
                {payment ? (
                    <PagamentoIntent
                        close={close}
                        callback={callback}
                        client={client}
                        payment={payment}
                        licenca={licenca}
                    />
                ) : (
                    <PagamentoInterno
                        close={close}
                        onPay={onPay}
                        callback={callback}
                        client={client}
                        licenca={licenca}
                        atSigth={atSigth}
                    />
                )}
            </Elements>
        </Modal>
    );
}

export default Pagamento;