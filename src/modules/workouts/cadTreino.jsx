import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { getExercises } from "../../api/exercises";
import { createOrUpdateWorkout } from "../../api/workouts";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import TreinoInteligente from "../../components/prescricao/treinoInteligente";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { useFormStore } from "../../hooks/useFormStore";
import { stateUsuario, useNotificacao } from "../../states/states";
import { preventForm } from "../../utils";

function CadTreino() {
   const location = useLocation();
   const treinoRecebido = location.state?.treino;
   const alunoRecebido = location.state?.aluno;
   const { formData, setTreinoForm, clearForm } = useFormStore();
   const { nSuccess } = useNotificacao();
   const form = useForm({ defaultValues: { ...treinoRecebido, sexo_treino: alunoRecebido?.sexo_aluno || "M" } });
   const {
      handleSubmit,
      setValue,
      getValues,
      watch,
      reset,
      formState: { isSubmitting, errors },
   } = form;
   const navigate = useNavigate();

   const { data: exerciciosLista } = useQuery({
      queryKey: ["exercicios"],
      queryFn: () => getExercises(false, "pt"),
      initialData: [],
   });

   const [usuario] = useRecoilState(stateUsuario);
   const [sessoes, setSessoes] = useState([]);
   const [nome_aluno, setNome_aluno] = useState("");
   const [codAluno, setCodAluno] = useState(0);
   const [sexo_aluno, setSexo_aluno] = useState(null);

   useEffect(() => {
      if (treinoRecebido) {
         Object.keys(treinoRecebido).forEach((key) => {
            setValue(key, treinoRecebido[key]);
         });
      } else {
         if (formData.treino?.cod_aluno == alunoRecebido?.cod_aluno) {
            Object.keys(formData.treino).forEach((key) => {
               setValue(key, formData.treino[key]);
            });
         }
      }
      if (alunoRecebido) setValue("cod_aluno", alunoRecebido.cod_aluno);
      if (alunoRecebido) setValue("nome_aluno", alunoRecebido.nome_aluno);
      if (alunoRecebido) {
         setNome_aluno(alunoRecebido.nome_aluno);
         setCodAluno(alunoRecebido.cod_aluno);
         setSexo_aluno(alunoRecebido.sexo_aluno);
         setValue("sexo_treino", alunoRecebido.sexo_aluno);
      } else {
         setSexo_aluno("M");
         setValue("sexo_treino", "M");
      }
      var sessaoKey = treinoRecebido?.sessoes?.map((sessao, index) => ({
         ...sessao,
         key: index + 1, // Adiciona a propriedade 'key' usando o 'cod_sessao'
      }));
      if (treinoRecebido?.sessoes) setSessoes(sessaoKey);
   }, [location, setValue, usuario]);

   const watched = watch();
   useEffect(() => {
      if (watched?.cod_treino) return;
      setTreinoForm(watched);
   }, [JSON.stringify(watched)]);

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [location]);

   function getRepeticao() {
      const { desenvolvimento_treino } = getValues();
      const base = {
         Força: 6,
         Hipertrofia: 12,
         Resistência: 20,
      };
      if (!desenvolvimento_treino) return 12;
      return base[desenvolvimento_treino];
   }

   function getSeries() {
      const { desenvolvimento_treino } = getValues();
      const base = {
         Força: 4,
         Hipertrofia: 3,
         Resistência: 2,
      };
      if (!desenvolvimento_treino) return 3;
      return base[desenvolvimento_treino];
   }

   function getInterval() {
      const { desenvolvimento_treino } = getValues();
      const base = {
         Força: 120,
         Hipertrofia: 80,
         Resistência: 40,
      };
      if (!desenvolvimento_treino) return 60;
      return base[desenvolvimento_treino];
   }

   async function confirma(data) {
      var podeConfirmar = true;
      for (const sessao of sessoes) {
         for (const exercicio of sessao.exercicios) {
            if (!exercicio?.cod_exercicio) {
               podeConfirmar = false;
               toast.error(`Exercício vazio na sessão ${sessao.nome_sessao}`);
            }

            if (exercicio?.sets) {
               for (const set of exercicio.sets) {
                  if (!set?.cod_exercicio) {
                     podeConfirmar = false;
                     toast.error(
                        `Exercício de super-set vazio na sessão ${sessao.nome_sessao} do exercício ${exercicio.nome_exercicio}`
                     );
                  }
               }
            }
         }
      }

      if (!podeConfirmar) return;

      const cod_usuario = usuario.cod_usuario;
      await createOrUpdateWorkout(
         {
            ...data,
            sexo_treino: sexo_aluno ?? data?.sexo_treino,
            cod_usuario,
            cod_empresa: usuario.cod_empresa,
         },
         sessoes
      );

      reset();
      clearForm();
      nSuccess();
      navigate(-1);
   }

   const { desenvolvimento_treino, volume_treino, nivel_treino } = watch();

   return (
      <FormProvider {...form}>
         <form onKeyDown={preventForm} onSubmit={handleSubmit(confirma)} className="container-fluid gap-3">
            <BackBoxUI />

            <Card>
               <CardContent>
                  {nome_aluno && <CardTitle className="mb-3">Treino do aluno: {nome_aluno}</CardTitle>}

                  <FitFormUI
                     errors={errors}
                     fields={[
                        {
                           title: "Informações iniciais",
                           cols: 4,
                           fields: [
                              {
                                 id: "name",
                                 label: "Nome",
                                 fieldName: "nome_treino",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 id: "periodicity",
                                 label: "Frequência",
                                 fieldName: "frequencia_treino",
                                 inputType: "number",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 id: "gender",
                                 label: "Sexo",
                                 fieldName: "sexo_treino",
                                 type: "select",
                                 selectOptions: [
                                    { label: "Masculino", value: "M" },
                                    { label: "Feminino", value: "F" },
                                 ],
                                 options: {
                                    required: true,
                                    // disabled: !!nome_aluno,
                                 },
                              },
                              {
                                 id: "difficulty",
                                 label: "Nível",
                                 fieldName: "nivel_treino",
                                 type: "select",
                                 selectOptions: ["Iniciante", "Intermediário", "Avançado"],
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 id: "observation",
                                 label: "Observação",
                                 fieldName: "observacao_treino",
                              },
                              {
                                 id: "development",
                                 label: "Desenvolvimento",
                                 fieldName: "desenvolvimento_treino",
                                 type: "select",
                                 selectOptions: ["Força", "Hipertrofia", "Resistência"],
                                 options: {
                                    required: true,
                                 },
                              },
                           ],
                        },
                     ]}
                  />
               </CardContent>
            </Card>

            <Card className="mt-3">
               <CardHeader>
                  <h5 className="card-title fw-semibold mb-4 mt-4">Prescrição</h5>
                  <label>{sessoes?.length}/15</label>
               </CardHeader>

               <CardContent className="px-0">
                  <TreinoInteligente
                     cod_aluno={codAluno}
                     sessoes={sessoes}
                     setSessoes={setSessoes}
                     getRepeticao={getRepeticao}
                     getInterval={getInterval}
                     getSeries={getSeries}
                     nivel_treino={nivel_treino}
                     volume_treino={volume_treino}
                     desenvolvimento_treino={desenvolvimento_treino}
                     exercicios={exerciciosLista}
                  />
               </CardContent>

               <CardFooter className="d-flex items-end justify-end mt-4 gap-3">
                  <Button id="submit" disabled={isSubmitting} type="submit">
                     <Check />
                     Confirmar
                  </Button>
               </CardFooter>
            </Card>
         </form>
      </FormProvider>
   );
}

export default CadTreino;
