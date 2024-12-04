import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAluno } from '../api/aluno';
import { Button } from 'react-bootstrap';
import { stateUsuario } from '../states/states';
import { useRecoilState } from 'recoil';

function CadAluno() {
    const { handleSubmit, register, setValue, watch } = useForm();
    const location = useLocation();
    const navigate = useNavigate();
    const [usuario] = useRecoilState(stateUsuario);

    const alunoRecebido = location.state?.aluno;
    let cepAtual = '';

    useEffect(() => {
        setValue('cod_usuario', usuario?.cod_usuario);
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
        await setAluno(data);
        navigate('/alunos');
    }

    return (
        <div className="container-fluid">
            <div className="card">
            <form className="card-body" onSubmit={handleSubmit(confirma)}>
                <Button href='javascript:history.back()' className="btn btn-danger mb-3">
                    <i className="bi bi-backspace me-2"></i>
                    Voltar
                </Button>

                <h5 className="card-title fw-semibold mb-4">Informações pessoais</h5>

                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Nome *</label>
                        <input { ...register('nome_aluno', { required: 'O nome é obrigatório' }) } type="text" className="form-control"/>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">CPF</label>
                        <input { ...register('cpf_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">RG</label>
                        <input { ...register('rg_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Telefone *</label>
                        <input { ...register('telefone_aluno', { required: 'O telefone é obrigatório' }) } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Data de nascimento *</label>
                        <input { ...register('data_nascimento_aluno', { required: 'A data de nascimento é obrigatória' }) } type="date" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Sexo *</label>
                        <select {...register('sexo_aluno', { required: 'O sexo é obrigatório' })} className="form-control">
                            <option value="M">Masculino</option>
                            <option value="F">Feminino</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Etnia *</label>
                        <select {...register('etnia_aluno', { required: 'A raça é obrigatória' })} className="form-control">
                            <option value="Caucasiano">Caucasiano</option>
                            <option value="Negro">Negro</option>
                            <option value="Asiático">Asiático</option>
                        </select>
                    </div>
                </div>

                <h5 className="card-title fw-semibold mb-4 mt-5">Acesso do app</h5>

                <div className='row g-3'>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">E-mail *</label>
                        <input { ...register('email_aluno', { required: 'O e-mail é obrigatório' }) } type="email" className="form-control" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">O aluno usará para acessar a plataforma</div>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Senha *</label>
                        <input { ...register('senha_aluno', { required: 'A senha é obrigatória' }) } type="password" className="form-control" id="exampleInputPassword1" />
                    </div>
                </div>

                <h5 className="card-title fw-semibold mb-4 mt-5">Endereço</h5>

                <div className="row g-3">
                    <div className="col-md-3">
                        <label className="form-label">CEP</label>
                        <input { ...register('cep_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Estado</label>
                        <input { ...register('estado_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Cidade</label>
                        <input { ...register('cidade_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Endereço</label>
                        <input { ...register('endereco_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Número</label>
                        <input { ...register('numero_aluno') } type="text" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label">Complemento</label>
                        <input { ...register('complemento_aluno') } type="text" className="form-control" />
                    </div>
                </div>

                <button type="submit" className="btn btn-success mt-3">
                    <i className="bi bi-check me-2"></i>
                    Confirmar
                </button>
            </form>
            </div>
        </div>
    );
}

export default CadAluno;