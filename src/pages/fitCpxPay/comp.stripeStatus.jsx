import { useEffect, useState } from "react";
import { getStatusAccount } from "../../api/pagamento";

function StripeStatus({ cod_empresa, cod_usuario }) {
    const [stripeStatus, setStripeStatus] = useState(null);

    useEffect(() => {
        (async function getStatus() {
            if (cod_empresa || cod_usuario) {
                const data = await getStatusAccount(cod_empresa, cod_usuario);
                if (data) setStripeStatus(data);
            }
        })();
    }, [cod_empresa, cod_usuario]);

    const traduzirCampo = (campo) => {
        const traducoes = {
            "external_account": "Conta bancária",
            "individual.id_number": "CPF",
            "individual.verification.document": "Documento de identidade",
            "individual.verification.document.front": "Frente do documento de identidade",
            "individual.verification.document.back": "Verso do documento de identidade",
            "individual.address.line1": "Endereço",
            "individual.address.city": "Cidade",
            "individual.address.state": "Estado",
            "individual.address.postal_code": "CEP",
            "individual.email": "E-mail",
            "individual.phone": "Telefone",
            "individual.dob.day": "Dia de nascimento",
            "individual.dob.month": "Mês de nascimento",
            "individual.dob.year": "Ano de nascimento",
            "company.tax_id": "CNPJ",
            "company.name": "Razão social",
            "company.address.line1": "Endereço da empresa",
            "company.address.city": "Cidade da empresa",
            "company.address.state": "Estado da empresa",
            "company.address.postal_code": "CEP da empresa",
            "company.phone": "Telefone da empresa",
            "company.verification.document": "Documento da empresa",
            "business_profile.url": "URL do perfil comercial",
            "business_profile.mcc": "Código MCC",
            "settings.payments.statement_descriptor": "Descrição no extrato bancário",
        };

        return traducoes[campo] || campo;
    };

    const renderPendencias = (lista, titulo, classeBorda) => {
        if (!lista || lista.length === 0) return null;
        return (
            <div className={`border-start ${classeBorda} bg-light p-3 rounded mb-3`}>
                <h5 className="mb-2 text-dark">
                    <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                    {titulo}
                </h5>

                <ul className="mb-0 ps-4">
                    {lista.map((item, index) => (
                        <li key={index} className="text-dark">{traduzirCampo(item)}</li>
                    ))}
                </ul>
            </div>
        );
    };

    if (!stripeStatus) return <p className="text-muted">Carregando status da conta...</p>;

    const { requirements, future_requirements } = stripeStatus;

    return (
        <div className="card p-4">
            <h4 className="mb-4">Pendências da Conta</h4>

            {renderPendencias(requirements?.currently_due, "Pendências atuais", "border-warning")}
            {renderPendencias(requirements?.past_due, "Pendências vencidas", "border-danger")}
            {renderPendencias(requirements?.eventually_due, "Pendências futuras", "border-primary")}
            {renderPendencias(future_requirements?.currently_due, "Requisitos futuros atuais", "border-warning")}
            {renderPendencias(future_requirements?.past_due, "Requisitos futuros vencidos", "border-danger")}
            {renderPendencias(future_requirements?.eventually_due, "Requisitos futuros pendentes", "border-primary")}
        </div>
    );
}

export default StripeStatus;