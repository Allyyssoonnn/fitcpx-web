import { useRecoilState } from "recoil";
import { stateUsuario } from "../states/states";
import { useMemo, useState } from "react";
import { getAlunos } from "../api/aluno";
import { useQuery } from "react-query";
import { calcularIdade } from "../utils";
import { useNavigate } from "react-router-dom";
import { getTreinos } from "../api/treino";

function Planilha() {
    const navigate = useNavigate();

    const [usuario] = useRecoilState(stateUsuario);
    const [searchTerm, setSearchTerm] = useState("");
    const [selecionados, setSelecionados] = useState([]);

    const { data: alunos } = useQuery({
            queryKey: ['alunos', usuario.cod_usuario],
            queryFn: () => getAlunos(usuario.cod_usuario),
            initialData: [],
        });

    const toggleSelecao = (index) => {
        if (selecionados.length == 15) return;
        setSelecionados((prevSelecao) => 
            prevSelecao.includes(index)
                ? prevSelecao.filter(item => item !== index) 
                : [...prevSelecao, index]
        );
    };

    const filteredAlunos = useMemo(() => {
        return alunos.filter((aluno) =>
            aluno.nome_aluno?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [alunos, searchTerm]);

    const abrirPlanilha = async () => {
        const alunosFiltrado = alunos.filter((_, index) => selecionados.includes(index))
        .map((aluno) => ({
            cod_aluno: aluno.cod_aluno,
            nome_aluno: aluno.nome_aluno,
            imagem_aluno: aluno.imagem_aluno,
            indexTreino: 0,
            openTab: false,
        }))

        for (const aluno of alunosFiltrado) {
            const treinos = await getTreinos({ cod_aluno: aluno.cod_aluno });
            aluno.treinos = treinos;
        }

        navigate('/planilhatreino', { state: { alunos: alunosFiltrado } });
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button className="btn btn-info" disabled={!selecionados.length} onClick={abrirPlanilha}>Abrir planilha</button>
                        <h4 className="card-title d-none d-md-block ms-3">Planilha de treinos</h4>
                        <h4 className="card-title d-none d-md-block ms-3">{selecionados.length}/15</h4>
                    </div>

                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="Pesquisar aluno"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="table-responsive">
                    <table id="basic-datatables" className="display table table-striped table-hover">
                        <tbody>
                            {filteredAlunos.map((aluno, index) => {
                                let idade = calcularIdade(aluno.data_nascimento_aluno);
                                return (
                                <tr key={aluno.cod_aluno} onClick={() => toggleSelecao(index)}>
                                    <th scope="row" className="d-flex align-items-center">
                                        <input checked={selecionados.includes(index)} className="me-3" type="checkbox" />
                                        <img
                                            src={aluno.imagem_aluno ? `${aluno.imagem_aluno}` : 'https://via.placeholder.com/150'}
                                            alt="Foto do Aluno" 
                                            className="img-fluid rounded-circle me-3" 
                                            style={{ width: '50px', height: '50px' }}
                                            loading="lazy"
                                        />
                                        <div className="col-md-3 d-flex flex-column">
                                            <label>{aluno.nome_aluno}</label>
                                            <label className="text-muted">{idade > 0 ? `${idade} anos` : '-'}</label>
                                        </div>
                                    </th>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Planilha;