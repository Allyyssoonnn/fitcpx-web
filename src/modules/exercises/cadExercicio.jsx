import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateExercise } from "../../api/exercises";
import {
   getEquipaments,
   getExerciseResistences,
   getExerciseTypes,
   getJoints,
   getMovementPatterns,
   getMuscleGroups,
   getSugestions,
} from "../../api/workouts";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { stateUsuario, useNotificacao } from "../../states/states";

function CadExercicio() {
   const location = useLocation();
   const exercicioRecebido = location.state?.exercicio;
   const { tSuccess } = useNotificacao();
   const form = useForm({ defaultValues: exercicioRecebido });
   const {
      handleSubmit,
      setValue,
      formState: { isSubmitting },
   } = form;
   const navigate = useNavigate();
   const [usuario] = useRecoilState(stateUsuario);

   const { data: grupos } = useQuery({
      queryKey: ["exercicios", usuario.cod_empresa],
      queryFn: getMuscleGroups,
      initialData: [],
   });

   const { data: equipamentos } = useQuery({
      queryKey: ["equipamentos", usuario.cod_empresa],
      queryFn: getEquipaments,
      initialData: [],
   });

   const { data: articulacoes } = useQuery({
      queryKey: ["joints"],
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

   const { data: indicacoes } = useQuery({
      queryKey: ["indicacoes", usuario.cod_empresa],
      queryFn: getSugestions,
      initialData: [],
   });

   const { data: padraoes_movimentos } = useQuery({
      queryKey: ["padraoes_movimentos", usuario.cod_empresa],
      queryFn: getMovementPatterns,
      initialData: [],
   });

   useEffect(() => {
      if (exercicioRecebido) {
         Object.keys(exercicioRecebido).forEach((key) => {
            setValue(key, exercicioRecebido[key]);
         });
      }
   }, [location, setValue, usuario]);

   async function confirma(data) {
      const cleanedData = Object.fromEntries(
         Object.entries(data).map(([key, value]) => [key, value === "" ? null : value]),
      );
      if (cleanedData.base_exercicio === "S") {
         await createOrUpdateExercise({
            cod_exercicio: cleanedData.cod_exercicio,
            base_exercicio: cleanedData.base_exercicio,
            url_exercicio_empresa: cleanedData?.url_exercicio_empresa,
         });
      } else {
         await createOrUpdateExercise({
            ...cleanedData,
            cod_usuario: usuario?.cod_usuario,
            cod_empresa: usuario?.cod_empresa,
            base_exercicio: "N",
         });
      }
      tSuccess();
      navigate("/exercicios");
   }

   return (
      <div className="container-fluid">
         <BackBoxUI />

         <Card>
            {exercicioRecebido?.base_exercicio === "S" && (
               <CardHeader>
                  <CardTitle className="text-destructive">Exercícios base não podem ser modificados</CardTitle>
                  <CardDescription>Mas você pode adicionar seu próprio vídeo autoral ao exercício</CardDescription>
               </CardHeader>
            )}

            <CardContent>
               <FormProvider {...form}>
                  <form onSubmit={handleSubmit(confirma)}>
                     <FitFormUI
                        fields={[
                           {
                              separator: true,
                              title: "Informações gerais",
                              cols: 4,
                              fields: [
                                 {
                                    label: "Nome",
                                    fieldName: "nome_exercicio",
                                    options: {
                                       required: true,
                                       disabled: exercicioRecebido?.base_exercicio === "S",
                                    },
                                 },
                                 {
                                    label: "URL (Vídeo exercício)",
                                    fieldName: "url_exercicio",
                                    options: {
                                       disabled: exercicioRecebido?.base_exercicio === "S",
                                    },
                                 },
                                 {
                                    label: "URL (Vídeo exercício autoral)",
                                    fieldName: "url_exercicio_empresa",
                                    options: {
                                       disabled: exercicioRecebido?.base_exercicio !== "S",
                                    },
                                 },
                              ],
                           },
                           {
                              separator: true,
                              cols: 4,
                              fields: [
                                 {
                                    label: "Tipo exercício",
                                    fieldName: "cod_tipo_exercicio",
                                    type: "select",
                                    selectOptions: tipo_exercicios.map((v) => ({
                                       label: v.nome_tipo_exercicio,
                                       value: v.cod_tipo_exercicio,
                                    })),
                                    options: {
                                       disabled: exercicioRecebido?.base_exercicio === "S",
                                    },
                                 },
                                 {
                                    label: "Exercício resistência",
                                    fieldName: "cod_exercicio_resistencia",
                                    type: "select",
                                    selectOptions: exercicios_resistencias.map((v) => ({
                                       label: v.nome_exercicio_resistencia,
                                       value: v.cod_exercicio_resistencia,
                                    })),
                                    options: {
                                       disabled: exercicioRecebido?.base_exercicio === "S",
                                    },
                                 },
                                 {
                                    label: "Indicação",
                                    fieldName: "cod_indicacao",
                                    type: "select",
                                    selectOptions: indicacoes.map((v) => ({
                                       label: v.nome_indicacao,
                                       value: v.cod_indicacao,
                                    })),
                                    options: {
                                       disabled: exercicioRecebido?.base_exercicio === "S",
                                    },
                                 },
                                 {
                                    label: "Padrão movimento",
                                    fieldName: "cod_padrao_movimento",
                                    type: "select",
                                    selectOptions: padraoes_movimentos.map((v) => ({
                                       label: v.nome_padrao_movimento,
                                       value: v.cod_padrao_movimento,
                                    })),
                                    options: {
                                       disabled: exercicioRecebido?.base_exercicio === "S",
                                    },
                                 },
                              ],
                           },
                           {
                              separator: true,
                              cols: 4,
                              title: "Grupos principais",
                              fields: [1, 2, 3, 4].map((v) => ({
                                 label: `Grupo ${v}`,
                                 fieldName: `cod_grupo_exercicio_${v}`,
                                 type: "select",
                                 selectOptions: grupos.map((v) => ({
                                    label: v.nome_grupo_exercicio,
                                    value: v.cod_grupo_exercicio,
                                 })),
                                 options: {
                                    disabled: exercicioRecebido?.base_exercicio === "S",
                                 },
                              })),
                           },
                           {
                              separator: true,
                              cols: 4,
                              title: "Grupos secundários",
                              fields: [5, 6, 7, 8].map((v) => ({
                                 label: `Grupo ${v}`,
                                 fieldName: `cod_grupo_exercicio_${v}`,
                                 type: "select",
                                 selectOptions: grupos.map((v) => ({
                                    label: v.nome_grupo_exercicio,
                                    value: v.cod_grupo_exercicio,
                                 })),
                                 options: {
                                    disabled: exercicioRecebido?.base_exercicio === "S",
                                 },
                              })),
                           },
                           {
                              separator: true,
                              cols: 4,
                              title: "Equipamentos",
                              fields: [1, 2, 3].map((v) => ({
                                 label: `Equipamento ${v}`,
                                 fieldName: `cod_equipamento_${v}`,
                                 type: "select",
                                 selectOptions: equipamentos.map((v) => ({
                                    label: v.nome_equipamento,
                                    value: v.cod_equipamento,
                                 })),
                                 options: {
                                    disabled: exercicioRecebido?.base_exercicio === "S",
                                 },
                              })),
                           },
                           {
                              separator: true,
                              cols: 4,
                              title: "Articulações",
                              fields: [1, 2, 3, 4].map((v) => ({
                                 label: `Articulação ${v}`,
                                 fieldName: `cod_articulacao_${v}`,
                                 type: "select",
                                 selectOptions: articulacoes.map((v) => ({
                                    label: v.nome_articulacao,
                                    value: v.cod_articulacao,
                                 })),
                                 options: {
                                    disabled: exercicioRecebido?.base_exercicio === "S",
                                 },
                              })),
                           },
                        ]}
                     />

                     <div className="d-flex justify-end">
                        <Button id="submit" type="submit" disabled={isSubmitting}>
                           <Check />
                           Confirmar
                        </Button>
                     </div>
                  </form>
               </FormProvider>
            </CardContent>
         </Card>
      </div>
   );
}

export default CadExercicio;
