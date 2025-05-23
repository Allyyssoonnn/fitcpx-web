import { useRecoilState } from "recoil";
import FitInputForm from "../../components/baseComponents/FitInputForm";
import { stateUsuario } from "../../states/states";

export function Usuario({ register, errors }) {
    const [usuario, setusuario] = useRecoilState(stateUsuario);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Usuário</h5>
                <h6>Dados do responsável pela empresa</h6>

                <form className="row">
                    <div className="col-lg-6">
                        <FitInputForm
                            nameField='Nome'
                            classNameContainer='mb-3'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.nome_usuario', { required: true }) }
                        />

                        <FitInputForm
                            nameField='Telefone'
                            classNameContainer='mb-3'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.telefone_usuario', { required: true }) }
                        />

                        <FitInputForm
                            nameField='CEP'
                            classNameContainer='mb-3'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.cep_usuario', { required: true }) }
                        />
                    </div>

                    <div className="col-lg-6">
                        <FitInputForm
                            nameField='E-mail'
                            classNameContainer='mb-3'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.email_usuario', { required: true }) }
                        />

                        <FitInputForm
                            nameField='Celular'
                            classNameContainer='mb-3'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.celular_usuario', { required: true }) }
                        />

                        <div className="mb-3 row">
                            <FitInputForm
                                nameField='Cidade'
                                classNameContainer='mb-3 col-6'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('usuario.cidade_usuario', { required: true }) }
                            />

                            <FitInputForm
                                nameField='Estado'
                                classNameContainer='mb-3 col-6'
                                errors={errors}
                                disabled={usuario.admin_usuario !== 'S'}
                                { ...register('usuario.estado_usuario', { required: true }) }
                            />
                        </div>
                    </div>

                    <div className="col-12 row">
                        <FitInputForm
                            nameField='Endereço'
                            classNameContainer='col-10'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.endereco_usuario', { required: true }) }
                        />

                        <FitInputForm
                            nameField='Número'
                            classNameContainer='col-2'
                            errors={errors}
                            disabled={usuario.admin_usuario !== 'S'}
                            { ...register('usuario.numero_usuario', { required: true }) }
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Usuario;