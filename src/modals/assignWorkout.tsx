import { getStudents } from "@/api/student";
import { createOrUpdateWorkout } from "@/api/workouts";
import FitComboBox from "@/components/baseComponents/FitComboBox";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "sonner";

const AssignWorkout = NiceModal.create(({ workout, navigate }: { workout: any; navigate: any }) => {
   const { visible, remove } = useModal();
   const [student, setStudent] = useState<any>(null);

   const { data: students } = useQuery({
      queryKey: ["students"],
      queryFn: () => getStudents(false),
      initialData: [],
   });

   async function onConfirm() {
      if (!student) toast.error("Selecione um aluno");

      const { cod_treino, ...treinoLimpo } = workout;
      treinoLimpo.sessoes = treinoLimpo.sessoes.map(({ cod_sessao, cod_treino, exercicios = [], ...sessao }: any) => ({
         ...sessao,
         exercicios: exercicios.map(({ cod_sessao_exercicio, ...exercicio }: any) => ({
            ...exercicio,
            sets: exercicio?.sets?.map(({ cod_sessao_exercicio, ...set }: any) => set) ?? [],
         })),
      }));
      treinoLimpo.status_treino = "A";

      const studentRaw = students.find((v: any) => v.cod_aluno == student);

      await createOrUpdateWorkout(
         {
            ...treinoLimpo,
            sexo_treino: studentRaw?.sexo_aluno ?? treinoLimpo?.sexo_treino,
            cod_aluno: student,
         },
         treinoLimpo.sessoes,
      );
      // navigate("/cadtreino", { state: { aluno: studentRaw, treino: treinoLimpo } });

      toast.success("Treino atribuido!");
      remove();
   }

   return (
      <Dialog open={visible} onOpenChange={remove}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle className="text-black">Atribuir Treino</DialogTitle>
               <DialogDescription>Atribuir treino ao aluno selecionado</DialogDescription>
            </DialogHeader>

            <FitComboBox
               name=""
               options={students.map((student: any, index: number) => ({
                  label: student.nome_aluno,
                  value: String(student.cod_aluno),
               }))}
               onChange={(v) => setStudent(v)}
               value={student || ""}
            />

            <DialogFooter>
               <Button onClick={onConfirm}>Confirmar</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
});

export const modalAssignWorkout = {
   show: (props?: any) => NiceModal.show(AssignWorkout, props),
   hide: () => NiceModal.hide(AssignWorkout),
};
