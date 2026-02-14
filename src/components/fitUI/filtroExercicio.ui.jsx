import { useQuery } from "@tanstack/react-query";
import { Funnel, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getExercises } from "../../api/exercises";
import {
   getEquipaments,
   getExerciseResistences,
   getExerciseTypes,
   getJoints,
   getMovementPatterns,
   getMuscleGroups,
} from "../../api/workouts";
import { stateUsuario } from "../../states/states";
import { filtrarExerciciosFunc } from "../../utils";
import { Button } from "../ui/button";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

export default function FiltroTreino({ confirma, exercicio, index, indexSet }) {
   const [exerciciosFiltrado, setExerciciosFiltrado] = useState([]);

   const { data: exercicios } = useQuery({
      queryKey: ["exercicios"],
      queryFn: getExercises,
      initialData: [],
   });

   function confirmaTreinoInteligente() {
      confirma(exerciciosFiltrado, index, indexSet);
   }

   return (
      <Dialog>
         <DialogTrigger>
            <Button type="button" size="icon">
               <Funnel />
            </Button>
         </DialogTrigger>

         <DialogContent>
            <DialogHeader>
               <DialogTitle>Filtro de exercícios</DialogTitle>
            </DialogHeader>

            <FiltroExercicio
               exercicios={exercicios}
               setExerciciosFiltrados={setExerciciosFiltrado}
               painel={true}
               exercicio={exercicio}
            />

            <DialogFooter>
               <DialogClose>
                  <Button onClick={confirmaTreinoInteligente}>Confirmar</Button>
               </DialogClose>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

function FiltroExercicio({ exercicios, setExerciciosFiltrados, exercicio = null }) {
   const [usuario] = useRecoilState(stateUsuario);

   const [grupoPrincipal, setGrupoPrincipal] = useState(() => exercicio?.cod_grupo_exercicio_1 || 0);
   const [grupoSecundario, setGrupoSecundario] = useState(0);
   const [equipamento, setEquipamento] = useState(0);
   const [articulacao, setArticulacao] = useState(0);
   const [tipoExercicio, setTipoExercicio] = useState(0);
   const [exercicioResistencia, setExercicioResistencia] = useState(0);
   const [padraoMovimento, setPadraoMovimento] = useState(0);

   const [limparFiltro, setlimparFiltro] = useState(false);

   useEffect(() => {
      if (
         !grupoPrincipal &&
         !grupoSecundario &&
         !equipamento &&
         !articulacao &&
         !tipoExercicio &&
         !exercicioResistencia &&
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
            padraoMovimento,
         };

         if (Object.values(filtrosAtuais).every((v) => !v)) {
            return setExerciciosFiltrados(null);
         }

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

      setlimparFiltro(false);
   }

   return (
      <div>
         <Button variant="outline" type="button" onClick={limpar} disabled={!limparFiltro}>
            <Trash />
            Limpar
         </Button>

         <Separator className="my-3" />

         <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
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

            <div>
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

            <div>
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

            <div>
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

            <div>
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

            <div>
               <label className="form-label fw-bold">Equipamento</label>
               <select className="form-control" value={equipamento} onChange={(e) => setEquipamento(e.target.value)}>
                  <option value={0}>Selecione</option>
                  {equipamentos.map((eq, i) => (
                     <option value={eq.cod_equipamento} key={i}>
                        {eq.nome_equipamento}
                     </option>
                  ))}
               </select>
            </div>

            <div>
               <label className="form-label fw-bold">Articulação</label>
               <select className="form-control" value={articulacao} onChange={(e) => setArticulacao(e.target.value)}>
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
   );
}
