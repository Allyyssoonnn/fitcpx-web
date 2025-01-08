import { useEffect, useState } from "react";

function MercadoPago() {
    const [paymentResult, setPaymentResult] = useState(null);

    useEffect(() => {
        const mp = new window.MercadoPago('TEST-eedab180-b6a0-40bc-8722-9018f3a31a65', { locale: 'pt-br' });
        const bricksBuilder = mp.bricks();

        const renderPaymentBrick = async () => {
            // Remove o Brick existente, se houver
            const existingBrick = document.getElementById('paymentBrick_container');
            console.log(existingBrick);
            
            if (existingBrick) {
                // existingBrick.remove();
            }

            // Verifica se o Brick já foi criado
            if (window.paymentBrickController) {
                console.log('Payment Brick já foi criado.');
                return;
            }

            const settings = {
                initialization: {
                    amount: 10000,
                    preferenceId: "<PREFERENCE_ID>",
                    payer: {
                        firstName: "",
                        lastName: "",
                        email: "",
                    },
                },
                customization: {
                    visual: {
                        style: {
                        theme: "bootstrap",
                        },
                    },
                    paymentMethods: {
                        creditCard: "all",
                        debitCard: "all",
                        atm: "all",
                        onboarding_credits: "all",
                        wallet_purchase: "all",
                        // ticket: "all",
                        bankTransfer: "all",
                        maxInstallments: 1,
                    },
                },
                callbacks: {
                    onReady: () => {
                        // Callback chamado quando o Brick está pronto
                    },
                    onSubmit: ({ selectedPaymentMethod, formData }) => {
                        console.log(selectedPaymentMethod, formData);
                        
                        try {
                            // const response = await fetch("/process_payment", {
                            //     method: "POST",
                            //     headers: {
                            //         "Content-Type": "application/json",
                            //     },
                            //     body: JSON.stringify(formData),
                            // });
                            // const result = await response.json();
                            // if (result.preferenceId) {
                            //     await handleGetPaymentResult(result.preferenceId);
                            // } else {
                            //     throw new Error("Pagamento não processado corretamente.");
                            // }
                        } catch (error) {
                            console.error(error);
                        }
                    },
                    onError: (error) => {
                        console.error(error);
                    },
                },
            };
      
            await mp.bricks().create(
                "payment",
                'paymentBrick_container',
                settings
            );
        };
        renderPaymentBrick(bricksBuilder);
    }, []);

    const handleGetPaymentResult = async (paymentId) => {
        try {
            const response = await fetch("/payment_result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ paymentId }),
            });

            const result = await response.json();
            setPaymentResult(result);
        } catch (error) {
            console.error("Erro ao obter resultado do pagamento:", error);
        }
    };

    return (
        <div className="container-fluid">
            <div id="paymentBrick_container"></div>
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