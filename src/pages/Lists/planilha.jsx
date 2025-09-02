import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { getStudents } from "../../api/student";
import { getTreinos } from "../../api/treino";
import { stateUsuario } from "../../states/states";
import { calcularIdade } from "../../utils";

function Planilha() {
   const navigate = useNavigate();

   const [usuario] = useRecoilState(stateUsuario);
   const [searchTerm, setSearchTerm] = useState("");
   const [selecionados, setSelecionados] = useState([]);

   const { data: alunos } = useQuery({
      queryKey: ["alunos", usuario.cod_usuario],
      queryFn: () => getStudents(),
      initialData: [],
      enabled: !!usuario.cod_empresa,
   });

   const toggleSelecao = (index) => {
      if (selecionados.length == 15) return;
      setSelecionados((prevSelecao) =>
         prevSelecao.includes(index) ? prevSelecao.filter((item) => item !== index) : [...prevSelecao, index]
      );
   };

   const filteredAlunos = useMemo(() => {
      return alunos.filter(
         (aluno) =>
            searchTerm
               .toLowerCase()
               .split(" ")
               .filter(Boolean)
               .every((word) =>
                  aluno.nome_aluno
                     ?.toLowerCase()
                     .normalize("NFD")
                     .replace(/[\u0300-\u036f]/g, "")
                     .includes(word)
               ) && aluno.status_aluno === "A"
      );
   }, [alunos, searchTerm]);

   const abrirPlanilha = async () => {
      const alunosFiltrado = alunos
         .filter((aluno, index) => selecionados.includes(aluno.cod_aluno))
         .map((aluno) => ({
            cod_aluno: aluno.cod_aluno,
            nome_aluno: aluno.nome_aluno,
            imagem_aluno: aluno.imagem_aluno,
            indexTreino: 0,
            openTab: false,
         }));
      for (const aluno of alunosFiltrado) {
         const treinos = await getTreinos({ cod_aluno: aluno.cod_aluno });
         aluno.treinos = treinos;
      }
      localStorage.setItem("planilhatreino", JSON.stringify(alunosFiltrado));
      navigate("/planilhatreino");
   };

   return (
      <div className="container-fluid">
         <div className="card shadow-lg rounded-4">
            <div className="card-header d-flex justify-content-between align-items-center">
               <div className="d-flex align-items-center">
                  <button className="btn rounded-3 btn-info" disabled={!selecionados.length} onClick={abrirPlanilha}>
                     <span className="d-flex d-md-none">Abrir</span>
                     <span className="d-none d-md-flex">Abrir planilha</span>
                  </button>
                  <h4 className="card-title d-none d-md-block ms-3">Planilha de treinos</h4>
                  <h4 className="card-title d-none d-md-block ms-3">{selecionados.length}/15</h4>
               </div>

               <div className="col-md-3 col-8">
                  <input
                     type="text"
                     className="form-control"
                     placeholder="Pesquisar aluno"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>

            <div className="table-responsive">
               <table id="basic-datatables" className="display table table-striped table-hover">
                  <tbody>
                     {filteredAlunos.map((aluno, index) => {
                        let idade = calcularIdade(aluno.data_nascimento_aluno);
                        return (
                           <tr key={aluno.cod_aluno} onClick={() => toggleSelecao(aluno.cod_aluno)}>
                              <th scope="row" className="d-flex align-items-center">
                                 <input
                                    checked={selecionados.includes(aluno.cod_aluno)}
                                    className="me-3"
                                    type="checkbox"
                                 />
                                 <img
                                    src={
                                       aluno.imagem_aluno
                                          ? `${aluno.imagem_aluno}`
                                          : "https://placehold.co/150x150?text=img"
                                    }
                                    alt="Foto do Aluno"
                                    className="img-fluid rounded-circle me-3"
                                    style={{ width: "50px", height: "50px" }}
                                    loading="lazy"
                                 />
                                 <div className="col-md-3 d-flex flex-column">
                                    <label>{aluno.nome_aluno}</label>
                                    <label className="text-muted">{idade > 0 ? `${idade} anos` : "-"}</label>
                                 </div>
                              </th>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

export default Planilha;
