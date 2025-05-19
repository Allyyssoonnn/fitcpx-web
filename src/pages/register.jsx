import { setCookie } from 'nookies';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { post } from "../api/api";
import { Modal } from 'react-bootstrap';
import { useState } from 'react';
import { stateEmpresa, stateUsuario } from '../states/states';
import { useRecoilState } from 'recoil';
import FitInputForm from '../components/baseComponents/FitInputForm';

function Register() {
    const navigate = useNavigate();
    const { handleSubmit, register, setError, clearErrors, watch, formState: { errors } } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usuario, setusuario] = useRecoilState(stateUsuario);
    const [empresa, setempresa] = useRecoilState(stateEmpresa);
    const acceptTerms = watch("acceptTerms");

    async function registrar(data) {
        console.log(data);
        
        if (!data.acceptTerms) {
            setError("acceptTerms", { type: "manual", message: "Você deve aceitar os termos e condições." });
            return;
        } else {
            clearErrors("acceptTerms");
        }
        
        const resp = await post('/usuario/register', data);

        if (resp.status) {
            toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
            setusuario(resp?.usuario);
            setempresa(resp?.empresa);
            setCookie(null, 'token', resp.token, { maxAge: 30000 });
            setCookie(null, 'refreshToken', resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
            navigate('/');
        } else {
            toast.error(resp?.msg);
        }
    }

    return (
        <div className="page-wrapper p-0" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed" style={{ marginLeft: '0' }}>
            <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="text-nowrap logo-img d-flex py-2 d-flex justify-content-center align-items-center">
                                        <img src="../assets/images/logos/logo.png" width='60' alt="" />
                                        <h1 className="mb-0 ms-3">Fit Cpx</h1>
                                    </div>

                                    <form onSubmit={handleSubmit(registrar)}>
                                        <FitInputForm
                                            classNameContainer='mb-3'
                                            nameField='Nome'
                                            errors={errors}
                                            { ...register('nome_usuario', { required: true, minLength: 5 }) }
                                        />

                                        <FitInputForm
                                            type='email'
                                            classNameContainer='mb-3'
                                            nameField='E-mail'
                                            errors={errors}
                                            { ...register('email_usuario', { required: true }) }
                                        />

                                        <FitInputForm
                                            type='password'
                                            classNameContainer='mb-3'
                                            nameField='Senha'
                                            errors={errors}
                                            { ...register('senha_usuario', { required: true, minLength: 5 }) }
                                        />

                                        <FitInputForm
                                            type='password'
                                            classNameContainer='mb-3'
                                            nameField='Confirmar senha'
                                            errors={errors}
                                            { ...register('senha_confirma', { required: true, minLength: 5 }) }
                                        />

                                        <div className="mb-4 form-check">
                                            <input { ...register('acceptTerms') } type="checkbox" className="form-check-input" id="acceptTerms" />
                                            <label className="form-check-label" htmlFor="acceptTerms">
                                                Eu li e aceito os <button type="button" className="btn btn-link p-0" onClick={() => setIsModalOpen(true)}>termos e condições</button>.
                                            </label>
                                            {acceptTerms === false && (
                                                <p className="text-danger mt-2">Você deve aceitar os termos e condições.</p>
                                            )}
                                        </div>

                                        <button type='submit' className="btn btn-primary w-100 py-8 fs-4 mb-4">Registrar</button>
                                        
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">Já tem uma conta?</p>
                                            <a className="text-primary fw-bold ms-2" href="/entrar">Entrar</a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={isModalOpen}
                on={() => setIsModalOpen(false)}
                contentLabel="Termos e Condições"
                className="modal fade"
                overlayClassName="modal-overlay"
            >
                <div className="card modal-dialog-scrollable modal-lg p-6">
                    <div className='card-header'>
                        <h2>Termos e Condições</h2>
                    </div>

                    <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto', padding: '1rem', border: '1px solid #ddd' }}>
                        {termos}
                    </pre>

                    <button onClick={() => setIsModalOpen(false)} className="btn btn-primary mt-3">Fechar</button>
                </div>
            </Modal>
      </div>
    );
}

const termos = `
Termos e Condições de Uso

1. Introdução

Bem-vindo(a) ao nosso sistema. Ao acessar ou utilizar este serviço, você concorda em cumprir os termos e condições estabelecidos neste documento. Caso não concorde com os termos aqui descritos, pedimos que não utilize o serviço.

2. Objetivo do Sistema

Este sistema foi desenvolvido para Gestão de aluno para profissionais da saúde. O usuário está ciente de que o uso do sistema é de sua inteira responsabilidade.

3. Responsabilidades do Usuário

3.1. O usuário se compromete a utilizar o sistema de acordo com a legislação vigente, de forma ética e sem prejudicar o funcionamento ou a segurança do serviço.

3.2. O usuário é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas através de sua conta.

4. Isenção de Responsabilidade

4.1. A empresa prestadora do serviço não se responsabiliza por qualquer tipo de dano, perda, custo, despesa ou consequência de qualquer natureza, direta ou indireta, resultante do uso ou da impossibilidade de uso do sistema, incluindo, mas não se limitando a:

Perda de dados;
Interrupção ou falha no serviço;
Erros ou omissões no conteúdo gerado ou processado pelo sistema;
Dano à reputação ou perda de oportunidades comerciais.
4.2. A empresa não garante que o sistema estará sempre disponível, livre de erros ou que seus servidores estarão livres de vírus ou outros componentes prejudiciais.

4.3. O usuário concorda em isentar a empresa de qualquer responsabilidade por danos ou perdas que possam ocorrer, seja por falhas no sistema, uso indevido por parte do usuário ou por causas externas além do controle da empresa.

5. Alterações no Sistema e nos Termos

5.1. A empresa se reserva o direito de modificar, suspender ou descontinuar qualquer parte do sistema, sem aviso prévio.

5.2. A empresa também pode alterar estes Termos e Condições a qualquer momento. Quaisquer alterações serão publicadas no sistema, e o uso continuado do serviço após as modificações será considerado como aceitação das novas condições.

6. Vigência e Rescisão

6.1. Este contrato entra em vigor no momento em que o usuário começa a utilizar o sistema e permanece válido até que o usuário cesse o uso ou até que a empresa resolva descontinuar o serviço.

6.2. A empresa pode, a seu critério, suspender ou encerrar a conta do usuário a qualquer momento, sem aviso prévio, caso o usuário viole quaisquer dos termos aqui estabelecidos.

7. Disposições Gerais

7.1. Este contrato será regido pelas leis vigentes no Brasil.

7.2. Caso alguma cláusula deste contrato seja considerada inválida, as demais disposições permanecerão em pleno vigor.

8. Aceitação dos Termos

Ao utilizar o sistema, o usuário declara ter lido, compreendido e aceitado todos os termos e condições aqui descritos.

Data da última atualização: 01/12/2024
`

export default Register;