import { useRecoilState } from "recoil";
import { stateUsuario } from "../../states/states";
import FitInputForm from "../../components/baseComponents/FitInputForm";

function DadosBancarios({ register, errors, prefixField }) {
    const [usuario] = useRecoilState(stateUsuario);

    return (
        <div className="col-md-6">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Conta bancária</h5>
                    <h6>Conta para receber o valor de saque</h6>

                    <div className="row">
                        <div>
                            <FitInputForm
                                nameField='Titular da conta'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register(`${prefixField}.titular_banco_conta`, { required: true }) }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div>
                            <FitInputForm
                                nameField='Código do banco'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register(`${prefixField}.codigo_banco_conta`, { required: true }) }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3">
                            <FitInputForm
                                nameField='Agência'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register(`${prefixField}.agencia_banco_conta`, { required: true }) }
                            />
                        </div>

                        <div className="col-lg-9">
                            <FitInputForm
                                nameField='Número da conta'
                                classNameContainer='mb-3'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register(`${prefixField}.numero_banco_conta`, { required: true }) }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DadosBancarios;