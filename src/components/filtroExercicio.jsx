import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import {
   getEquipaments,
   getExerciseResistences,
   getExerciseTypes,
   getJoints,
   getMovementPatterns,
   getMuscleGroups,
} from "../api/workouts";
import { stateUsuario } from "../states/states";
import { filtrarExerciciosFunc } from "../utils";

function FiltroExercicio({ exercicios, setExerciciosFiltrados, painel = false, exercicio = null }) {
   const [usuario] = useRecoilState(stateUsuario);

   const [grupoPrincipal, setGrupoPrincipal] = useState(
      () => exercicio?.cod_grupo_exercicio_1 || Number(sessionStorage.getItem("grupoPrincipal")) || 0
   );
   const [grupoSecundario, setGrupoSecundario] = useState(() =>
      !exercicio?.cod_exercicio ? Number(sessionStorage.getItem("grupoSecundario")) || 0 : 0
   );
   const [equipamento, setEquipamento] = useState(() =>
      !exercicio?.cod_exercicio ? Number(sessionStorage.getItem("equipamento")) || 0 : 0
   );
   const [articulacao, setArticulacao] = useState(() =>
      !exercicio?.cod_exercicio ? Number(sessionStorage.getItem("articulacao")) || 0 : 0
   );
   const [tipoExercicio, setTipoExercicio] = useState(
      () => exercicio?.cod_tipo_exercicio || Number(sessionStorage.getItem("tipoExercicio")) || 0
   );
   const [exercicioResistencia, setExercicioResistencia] = useState(() =>
      !exercicio?.cod_exercicio ? Number(sessionStorage.getItem("exercicioResistencia")) || 0 : 0
   );
   // const [indicacao, setIndicacao] = useState(() => exercicio?.cod_indicacao || Number(sessionStorage.getItem("indicacao")) || 0);
   const [padraoMovimento, setPadraoMovimento] = useState(() =>
      !exercicio?.cod_exercicio ? Number(sessionStorage.getItem("padraoMovimento")) || 0 : 0
   );

   const [limparFiltro, setlimparFiltro] = useState();

   useEffect(() => {
      sessionStorage.setItem("grupoPrincipal", grupoPrincipal);
      sessionStorage.setItem("grupoSecundario", grupoSecundario);
      sessionStorage.setItem("equipamento", equipamento);
      sessionStorage.setItem("articulacao", articulacao);
      sessionStorage.setItem("tipoExercicio", tipoExercicio);
      sessionStorage.setItem("exercicioResistencia", exercicioResistencia);
      // sessionStorage.setItem("indicacao", indicacao);
      sessionStorage.setItem("padraoMovimento", padraoMovimento);

      if (
         !grupoPrincipal &&
         !grupoSecundario &&
         !equipamento &&
         !articulacao &&
         !tipoExercicio &&
         !exercicioResistencia &&
         // && !indicacao
         !padraoMovimento
      ) {
         setlimparFiltro(false);
      } else setlimparFiltro(true);

      const filtrarExercicios = () => {
         const filtrosAtuais = {
            grupoPrincipal,
            grupoSecundario,
            equipamento,
            articulacao,
            tipoExercicio,
            exercicioResistencia,
            // indicacao,
            padraoMovimento,
         };

         //Verifica se existe filtro preenchido
         if (Object.values(filtrosAtuais).every((valor) => !valor || valor === 0)) {
            setExerciciosFiltrados(exercicios);
            return;
         }

         var exerciciosFiltrados = [...exercicios];

         exerciciosFiltrados = filtrarExerciciosFunc(exerciciosFiltrados, filtrosAtuais);

         setExerciciosFiltrados(exerciciosFiltrados);
      };

      filtrarExercicios();
   }, [
      exercicios,
      grupoPrincipal,
      grupoSecundario,
      equipamento,
      articulacao,
      tipoExercicio,
      exercicioResistencia,
      padraoMovimento,
      limparFiltro,
   ]);

   const { data: grupos } = useQuery({
      queryKey: ["grupos", usuario.cod_empresa],
      queryFn: getMuscleGroups,
      initialData: [],
   });

   const { data: equipamentos } = useQuery({
      queryKey: ["equipamentos", usuario.cod_empresa],
      queryFn: getEquipaments,
      initialData: [],
   });

   const { data: articulacoes } = useQuery({
      queryKey: ["articulacoes", usuario.cod_empresa],
      queryFn: getJoints,
      initialData: [],
   });

   const { data: tipo_exercicios } = useQuery({
      queryKey: ["tipo_exercicios", usuario.cod_empresa],
      queryFn: getExerciseTypes,
      initialData: [],
   });

   const { data: exercicios_resistencias } = useQuery({
      queryKey: ["exercicios_resistencias", usuario.cod_empresa],
      queryFn: getExerciseResistences,
      initialData: [],
   });

   const { data: padraoes_movimentos } = useQuery({
      queryKey: ["padraoes_movimentos", usuario.cod_empresa],
      queryFn: getMovementPatterns,
      initialData: [],
   });

   function limpar(e) {
      e.preventDefault();
      setGrupoPrincipal(0);
      setGrupoSecundario(0);
      setEquipamento(0);
      setArticulacao(0);
      setTipoExercicio(0);
      setExercicioResistencia(0);
      // setIndicacao(0);
      setPadraoMovimento(0);
      sessionStorage.setItem("grupoPrincipal", 0);
      sessionStorage.setItem("grupoSecundario", 0);
      sessionStorage.setItem("equipamento", 0);
      sessionStorage.setItem("articulacao", 0);
      sessionStorage.setItem("tipoExercicio", 0);
      sessionStorage.setItem("exercicioResistencia", 0);
      // sessionStorage.setItem("indicacao", 0);
      sessionStorage.setItem("padraoMovimento", 0);
      setlimparFiltro(false);
   }

   return (
      <div className={`${painel ? "" : "accordion"}`}>
         <div className="accordion-item">
            <h2 className="accordion-header">
               <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle={`${painel ? "" : "collapse"}`}
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
               >
                  <span className={`${painel ? "d-none" : ""}`}>Filtros</span>
                  <button
                     onClick={limpar}
                     className={`${!limparFiltro ? "d-none" : ""} btn btn-outline-primary btn-sm ms-2`}
                  >
                     <i className="bi bi-x-circle me-2"></i>
                     Limpar
                  </button>
               </button>
            </h2>

            <div id="panelsStayOpen-collapseOne" className={`accordion-collapse ${painel ? "" : "collapse"}`}>
               <div className="accordion-body row g-3">
                  <div className="col-md-4">
                     <label className="form-label fw-bold">Grupo principal</label>
                     <select
                        className="form-control"
                        value={grupoPrincipal}
                        onChange={(e) => setGrupoPrincipal(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {grupos.map((gp, i) => (
                           <option value={gp.cod_grupo_exercicio} key={i}>
                              {gp.nome_grupo_exercicio}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-4">
                     <label className="form-label fw-bold">Grupo secundário</label>
                     <select
                        className="form-control"
                        value={grupoSecundario}
                        onChange={(e) => setGrupoSecundario(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {grupos.map((gp, i) => (
                           <option value={gp.cod_grupo_exercicio} key={i}>
                              {gp.nome_grupo_exercicio}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-4">
                     <label className="form-label fw-bold">Tipo exercício</label>
                     <select
                        className="form-control"
                        value={tipoExercicio}
                        onChange={(e) => setTipoExercicio(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {tipo_exercicios.map((te, i) => (
                           <option value={te.cod_tipo_exercicio} key={i}>
                              {te.nome_tipo_exercicio}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-4">
                     <label className="form-label fw-bold">Resistência</label>
                     <select
                        className="form-control"
                        value={exercicioResistencia}
                        onChange={(e) => setExercicioResistencia(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {exercicios_resistencias.map((er, i) => (
                           <option value={er.cod_exercicio_resistencia} key={i}>
                              {er.nome_exercicio_resistencia}
                           </option>
                        ))}
                     </select>
                  </div>

                  {/* <div className="col-md-4">
                            <label className="form-label fw-bold">Indicação</label>
                            <select className="form-control" value={indicacao} onChange={e => setIndicacao(e.target.value)}>
                                <option value={0}>Selecione</option>
                                {indicacoes.map((id, i) => (
                                    <option value={id.cod_indicacao} key={i}>{id.nome_indicacao}</option>
                                ))}
                            </select>
                        </div> */}

                  <div className="col-md-4">
                     <label className="form-label fw-bold">Padrão movimento</label>
                     <select
                        className="form-control"
                        value={padraoMovimento}
                        onChange={(e) => setPadraoMovimento(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {padraoes_movimentos.map((pm, i) => (
                           <option value={pm.cod_padrao_movimento} key={i}>
                              {pm.nome_padrao_movimento}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-4">
                     <label className="form-label fw-bold">Equipamento</label>
                     <select
                        className="form-control"
                        value={equipamento}
                        onChange={(e) => setEquipamento(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {equipamentos.map((eq, i) => (
                           <option value={eq.cod_equipamento} key={i}>
                              {eq.nome_equipamento}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="col-md-4">
                     <label className="form-label fw-bold">Articulação</label>
                     <select
                        className="form-control"
                        value={articulacao}
                        onChange={(e) => setArticulacao(e.target.value)}
                     >
                        <option value={0}>Selecione</option>
                        {articulacoes.map((at, i) => (
                           <option value={at.cod_articulacao} key={i}>
                              {at.nome_articulacao}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default FiltroExercicio;
