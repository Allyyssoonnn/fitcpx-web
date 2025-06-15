import { Modal } from "react-bootstrap";
import NewPayment from "./newPayment/newPayment";
import ExistPayment from "./existPayment/existPayment";

function Pagamento({ show, close, onPay, callback, asaas_id, atSigth, clientId }) {

    return (
        <Modal show={show} size="md">
            {asaas_id ? (
                <ExistPayment
                    close={close}
                    asaas_id={asaas_id}
                    clientId={clientId}
                />
            ) : (
                <NewPayment
                    close={close}
                    onPay={onPay}
                    callback={callback}
                    atSigth={atSigth}
                    clientId={clientId}
                />
            )}
        </Modal>
    );
}

export default Pagamento;