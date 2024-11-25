/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Avaliacao() {
    const navigate = useNavigate();
    const location = useLocation();

    const [avaliacao, setAvaliacao] = useState({});

    useEffect(() => {
        const avaliacaoRecebida = location.state?.avaliacao;
        avaliacaoRecebida ? setAvaliacao(avaliacaoRecebida) : navigate('/alunos');
    }, []);

    if (!avaliacao) {
        return <div>Carregando...</div>;
    }

    const imprimirResultados = () => {
        const printContent = document.getElementById("printable-area");
        const printWindow = window.open('', '', 'height=600, width=800');
        printWindow.document.write('<html><head><title>Resultado da Avaliação</title></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const getTotalDobras = () => {
        const dobras = [
            avaliacao.triciptal,
            avaliacao.peitoral,
            avaliacao.subescapular,
            avaliacao.axilar_media,
            avaliacao.abdominal,
            avaliacao.coxa,
            avaliacao.supra_iliaca
        ];
        
        return dobras.reduce((total, valor) => {
            return total + (parseFloat(valor) || 0);
        }, 0);
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <button onClick={() => navigate(-1)} className="btn btn-danger mb-3 me-3">
                        <i className="bi bi-backspace me-2"></i>
                        Voltar
                    </button>

                    <button onClick={imprimirResultados} className="btn btn-primary mb-3">
                        <i className="bi bi-printer me-2"></i>
                        Imprimir
                    </button>
                </div>

                <div className="card-body" id="printable-area">
                    <div className="row mb-3">
                        <h5>Resultado da Avaliação</h5>
                        <p><strong>Data da Avaliação:</strong> {avaliacao.data_avaliacao}</p>
                        <p><strong>Peso:</strong> {avaliacao.peso} kg</p>
                        <p><strong>Altura:</strong> {avaliacao.altura} cm</p>
                        <p><strong>Total dobras:</strong> {getTotalDobras()} cm</p>
                    </div>

                    <SimetriaMembro avaliacao={avaliacao} />

                    <h4>Perímetro</h4>

                    <div className="row g-3 mt-3">
                        <div className="col-md-4">
                            <h6>Geral</h6>
                            <ul>
                                <li><strong>Pescoco:</strong> {avaliacao.pescoco || '-'} cm</li>
                                <li><strong>Ombro:</strong> {avaliacao.ombro || '-'} cm</li>
                                <li><strong>Tórax Inspirado:</strong> {avaliacao.torax_inspirado || '-'} cm</li>
                                <li><strong>Tórax Expirado:</strong> {avaliacao.torax_expirado || '-'} cm</li>
                                <li><strong>Punho:</strong> {avaliacao.punho || '-'} cm</li>
                                <li><strong>Cintura:</strong> {avaliacao.cintura || '-'} cm</li>
                                <li><strong>Abdômen:</strong> {avaliacao.abdomen || '-'} cm</li>
                                <li><strong>Quadril:</strong> {avaliacao.quadril || '-'} cm</li>
                            </ul>
                        </div>

                        <div className="col-md-4">
                            <h6>Lado direito</h6>
                            <ul>
                                <li><strong>Braço Relaxado Direito:</strong> {avaliacao.braco_relaxado_direito || '-'} cm</li>
                                <li><strong>Braço Contraído Direito:</strong> {avaliacao.braco_contraido_direito || '-'} cm</li>
                                <li><strong>Antebraço Direito:</strong> {avaliacao.antebraco_direito || '-'} cm</li>
                                <li><strong>Coxa Direita:</strong> {avaliacao.coxa_direita || '-'} cm</li>
                                <li><strong>Panturrilha Direita:</strong> {avaliacao.panturrilha_direita || '-'} cm</li>
                            </ul>
                        </div>

                        <div className="col-md-4">
                            <h6>Lado esquerdo</h6>
                            <ul>
                                <li><strong>Braço Relaxado Esquerdo:</strong> {avaliacao.braco_relaxado_esquerdo || '-'} cm</li>
                                <li><strong>Braço Contraído Esquerdo:</strong> {avaliacao.braco_contraido_esquerdo || '-'} cm</li>
                                <li><strong>Antebraço Esquerdo:</strong> {avaliacao.antebraco_esquerdo || '-'} cm</li>
                                <li><strong>Coxa Esquerda:</strong> {avaliacao.coxa_esquerda || '-'} cm</li>
                                <li><strong>Panturrilha Esquerda:</strong> {avaliacao.panturrilha_esquerda || '-'} cm</li>
                            </ul>
                        </div>
                    </div>

                    <h4>Diamêtro</h4>

                    <ul className="mt-3">
                        <li><strong>Biestilóide punho:</strong> {avaliacao.biestiloide_punho || '-'} cm</li>
                        <li><strong>Biepicôndilo Umeral:</strong> {avaliacao.biepicondilo_umeral || '-'} cm</li>
                        <li><strong>Biepicôndilo femoral:</strong> {avaliacao.biepicondilo_femoral || '-'} cm</li>
                    </ul>

                    <h4>Dobras cutâneas</h4>

                    <ul className="mt-3">
                        <li><strong>Triciptal:</strong> {avaliacao.triciptal || '-'} cm</li>
                        <li><strong>Peitoral:</strong> {avaliacao.peitoral || '-'} cm</li>
                        <li><strong>Subescapular:</strong> {avaliacao.subescapular || '-'} cm</li>
                        <li><strong>Axilar Media:</strong> {avaliacao.axilar_media || '-'} cm</li>
                        <li><strong>Abdominal:</strong> {avaliacao.abdominal || '-'} cm</li>
                        <li><strong>Coxa:</strong> {avaliacao.coxa || '-'} cm</li>
                        <li><strong>Supra Ilíaca:</strong> {avaliacao.supra_iliaca || '-'} cm</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function SimetriaMembro({ avaliacao }) {
    const getDifferenceClass = (diff) => {
        return diff > 1 ? 'bg-danger' : '';
    };

    return (
        <div className="table-responsive">
            <h6>Simetria dos membros</h6>

            <table id="basic-datatables" className="display table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Membro</th>
                        <th>Direito</th>
                        <th>Diferença</th>
                        <th>Esquerdo</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th>Braço</th>
                        <th>{avaliacao.braco_relaxado_direito || '-'}</th>
                        <th
                            className={getDifferenceClass(avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito)}
                        >{(avaliacao.braco_relaxado_esquerdo - avaliacao.braco_relaxado_direito).toFixed(2) || '-'}</th>
                        <th>{avaliacao.braco_relaxado_esquerdo || '-'}</th>
                    </tr>
                    <tr>
                        <th>Braço contraido</th>
                        <th>{avaliacao.braco_contraido_direito || '-'}</th>
                        <th
                            className={getDifferenceClass(avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo)}
                        >{(avaliacao.braco_contraido_direito - avaliacao.braco_contraido_esquerdo).toFixed(2) || '-'}</th>
                        <th>{avaliacao.braco_contraido_esquerdo || '-'}</th>
                    </tr>
                    <tr>
                        <th>Antebraço</th>
                        <th>{avaliacao.antebraco_direito || '-'}</th>
                        <th
                            className={getDifferenceClass(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo)}
                        >{(avaliacao.antebraco_direito - avaliacao.antebraco_esquerdo).toFixed(2) || '-'}</th>
                        <th>{avaliacao.antebraco_esquerdo || '-'}</th>
                    </tr>
                    <tr>
                        <th>Coxa</th>
                        <th>{avaliacao.coxa_direita || '-'}</th>
                        <th
                            className={getDifferenceClass(avaliacao.coxa_direita - avaliacao.coxa_esquerda)}
                        >{(avaliacao.coxa_direita - avaliacao.coxa_esquerda).toFixed(2) || '-'}</th>
                        <th>{avaliacao.coxa_esquerda || '-'}</th>
                    </tr>
                    <tr>
                        <th>Coxa</th>
                        <th>{avaliacao.panturrilha_direita || '-'}</th>
                        <th
                            className={getDifferenceClass(avaliacao.panturrilha_direita - avaliacao.panturrilha_esquerda)}
                        >{(avaliacao.panturrilha_direita - avaliacao.panturrilha_esquerda).toFixed(2) || '-'}</th>
                        <th>{avaliacao.panturrilha_esquerda || '-'}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Avaliacao;