import { useEffect, useState } from "react";
import { donePagamento, getPagamento } from "../api/pagamento";

import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import { useRecoilState } from "recoil";
import { stateEmpresa, stateUsuario } from "../states/states";
initMercadoPago('TEST-0c760096-60b1-44cc-ae5a-317a87771c24');

function MercadoPago({ show, recorrente, close }) {
    const [empresa] = useRecoilState(stateEmpresa);
    const [usuario] = useRecoilState(stateUsuario);
    const [paymentResult, setPaymentResult] = useState(null);
    const [pagamento, setPagamento] = useState();

    useEffect(() => {
        if (!show) return;
        (async function load() {
            if (!pagamento) {
                const respId = await getPagamento(usuario.cod_usuario, usuario.cod_empresa, recorrente);
                setPagamento(respId);
            }
        })();
        
        return () => window?.paymentBrickController?.unmount();
    }, [pagamento, show]);

    if (!show) return;

    const onSubmit = async (formData) => {
        console.log("Pagamento iniciado:", formData);
        const resp = await donePagamento(formData, usuario.cod_usuario, usuario.cod_empresa, recorrente);
        if (resp) close();
        // Aqui você pode enviar os dados para o backend para processar o pagamento
        // setPaymentResult(formData);
    };
      
    const onError = async (error) => {
        console.error("Erro no Payment Brick:", error);
    };
      
    const onReady = async () => {
        console.log("Payment Brick pronto");
    };

    const paymentMethods = recorrente ? {
        excludedPaymentMethods: [
            { id: "bank_transfer" },
            { id: "debit_card" },
            { id: "ticket" },
            { id: "mercado_pago" },
        ],
        creditCard: "all",
        maxInstallments: 1,
    } : {
        bankTransfer: "all",
        creditCard: "all",
        debitCard: "all",
        mercadoPago: "all",
        maxInstallments: 1,
    }

    return (
        <div className="container-fluid">
            {pagamento?.preferenceId && (
                <Payment
                    initialization={{
                        amount: pagamento.amount,
                        preferenceId: pagamento.preferenceId,
                        payer: {
                            name: empresa.nome_empresa,
                            email: empresa.email_empresa,
                            identification: empresa.doc_empresa,
                        },
                    }}
                    onSubmit={onSubmit}
                    customization={{
                        paymentMethods: paymentMethods,
                        visual: {
                            style: "bootstrap",
                        },
                    }}
                    locale='pt-BR'
                />
            )}
            {paymentResult ? (
                <div>
                    <h3>Resultado do pagamento:</h3>
                    <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
                </div>
            ) : (
                <p>Processando pagamento...</p>
            )}
        </div>
    );
}

export default MercadoPago;