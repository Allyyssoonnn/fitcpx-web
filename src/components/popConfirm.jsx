

function PopConfirm({ confirm }) {

    function clickConfirm() {
        confirm();
    }

    return (
        <div className="dropdown">
            <a href="#" className="text-danger" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-trash me-2"></i>
            </a>

            <ul className="dropdown-menu text-center">
                <li>
                    <span>Tem certeza?</span>
                </li>

                <li className="d-flex gap-3 mt-3">
                    <button className="btn btn-sm btn-danger" data-bs-toggle="dropdown">Cancelar</button>

                    <button className="btn btn-sm btn-success me-2" onClick={clickConfirm}>Confirmar</button>
                </li>
            </ul>
        </div>
    );
}

export default PopConfirm;