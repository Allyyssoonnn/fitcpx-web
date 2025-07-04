import { Modal } from "react-bootstrap";
import NewPayment from "./newPayment/newPayment";

function Pagamento({ show, close, onPay, callback, asaas_id, atSigth }) {
    return (
        <Modal show={show} size="md">
            <NewPayment
                close={close}
                onPay={onPay}
                callback={callback}
                atSigth={atSigth}
            />
        </Modal>
    );
}

export default Pagamento;