import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAluno } from '../api/aluno';
import { stateUsuario, useNotificacao } from '../states/states';
import { useRecoilState } from 'recoil';
import { limpaForm } from '../utils';
import FitInputForm from '../components/baseComponents/FitInputForm';
import FitSelectForm from '../components/baseComponents/FitSelectForm';
import FitStateForm from '../components/baseComponents/FitStateForm';

function CadAluno() {
    const { nSuccess } = useNotificacao();
    const { handleSubmit, register, setValue, watch, formState: { isSubmitting, errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [usuario] = useRecoilState(stateUsuario);

    const alunoRecebido = location.state?.aluno;
    let cepAtual = '';

    useEffect(() => {
        setValue('cod_usuario', usuario?.cod_usuario);
        setValue('cod_empresa', usuario?.cod_empresa);
        watch((value) => {
            const { cep_aluno } = value;

            if (cep_aluno?.length === 8) {
                if (cepAtual === cep_aluno) return;
                cepAtual = cep_aluno;
                fetch(`https://viacep.com.br/ws/${cep_aluno}/json/`)
                .then((resp) => {
                    if (!resp.ok) {
                        throw new Error('Erro ao buscar informações do CEP.');
                    }
                    return resp.json(); // Extrai o corpo da resposta em formato JSON
                })
                .then((data) => {
                    if (data.logradouro) setValue('endereco_aluno', data.logradouro);
                    if (data.uf) setValue('estado_aluno', data.uf);
                    if (data.localidade) setValue('cidade_aluno', data.localidade);
                    if (data.bairro) setValue('bairro_aluno', data.bairro);
                    if (data.complemento) setValue('complemento_aluno', data.complemento);
                    if (data.cep) setValue('cep_aluno', data.cep);
                })
                .catch((error) => {
                    console.error('Erro:', error.message);
                });
            }
        })
        
    }, [watch]);

    useEffect(() => {
        if (alunoRecebido) {
            Object.keys(alunoRecebido).forEach((key) => {
                setValue(key, alunoRecebido[key]);
            });
        }
    }, [alunoRecebido, setValue]);

    async function confirma(data) {
        await setAluno(limpaForm(data));
        nSuccess();
        navigate("/aluno", { state: { cod_aluno: data.cod_aluno } });
    }

    return (
        <div className="container-fluid">
            <div className="card">
            <form className="card-body" onSubmit={handleSubmit(confirma)}>
                <button onClick={e => { e.preventDefault(); navigate(-1) }} className="btn btn-danger mb-3">
                    <i className="bi bi-backspace me-2"></i>
                    Voltar
                </button>

                <h5 className="card-title fw-semibold mb-4">Informações pessoais</h5>

                <div className="row g-3">
                    <FitInputForm
                        nameField='Nome *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('nome_aluno', { required: true, minLength: 5 }) }
                    />

                    <FitInputForm
                        nameField='CPF'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('cpf_aluno') }
                    />

                    <FitInputForm
                        nameField='RG'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('rg_aluno') }
                    />

                    <FitInputForm
                        nameField='Telefone *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('telefone_aluno', { required: true }) }
                    />

                    <FitInputForm
                        type="date"
                        nameField='Data de nascimento *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('data_nascimento_aluno') }
                    />

                    <FitSelectForm
                        nameField='Sexo *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        {...register('sexo_aluno', { required: true })}
                    >
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </FitSelectForm>

                    <FitSelectForm
                        nameField='Etnia *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        {...register('etnia_aluno', { required: true })}
                    >
                        <option value="Caucasiano">Caucasiano</option>
                        <option value="Negro">Negro</option>
                        <option value="Asiático">Asiático</option>
                    </FitSelectForm>
                </div>

                <h5 className="card-title fw-semibold mb-4 mt-5">Acesso do app</h5>

                <div className='row g-3'>
                    <FitInputForm
                        textHelp='O aluno usará para acessar o app do aluno'
                        type="email"
                        nameField='E-mail *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('email_aluno', { required: true, minLength: 5 }) }
                    />

                    <FitInputForm
                        type="password"
                        nameField='Senha *'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('senha_aluno', { required: true, minLength: 5 }) }
                    />
                </div>

                <h5 className="card-title fw-semibold mb-4 mt-5">Endereço</h5>

                <div className="row g-3">
                    <FitInputForm
                        nameField='CEP'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('cep_aluno') }
                    />
                    
                    <FitStateForm
                        nameField="Estado"
                        classNameContainer="col-md-3"
                        {...register("estado_aluno")}
                        errors={errors}
                    />
                    
                    <FitInputForm
                        nameField='Cidade'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('cidade_aluno') }
                    />

                    <FitInputForm
                        nameField='Endereço'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('endereco_aluno') }
                    />

                    <FitInputForm
                        nameField='Número'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('numero_aluno', { maxLength: 10 }) }
                    />

                    <FitInputForm
                        nameField='Bairro'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('bairro_aluno') }
                    />

                    <FitInputForm
                        nameField='Complemento'
                        classNameContainer='col-md-3'
                        errors={errors}
                        { ...register('complemento_aluno') }
                    />
                </div>

                <button disabled={isSubmitting} type="submit" className="btn btn-success mt-3">
                    <i className="bi bi-check me-2"></i>
                    Confirmar
                </button>
            </form>
            </div>
        </div>
    );
}

export default CadAluno;