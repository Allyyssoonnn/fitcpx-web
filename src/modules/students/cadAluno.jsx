import { Check } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateStudent } from "../../api/student";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useFormStore } from "../../hooks/useFormStore";
import { stateUsuario, useNotificacao } from "../../states/states";
import { limpaForm, states } from "../../utils";

function CadAluno() {
   const location = useLocation();
   const alunoRecebido = location.state?.aluno;
   const { formData, setAlunoForm, clearForm } = useFormStore();
   const { nSuccess } = useNotificacao();
   const form = useForm({ defaultValues: alunoRecebido });
   const {
      handleSubmit,
      setValue,
      watch,
      formState: { isSubmitting, errors },
   } = form;
   const navigate = useNavigate();
   const [usuario] = useRecoilState(stateUsuario);

   let cepAtual = "";

   useEffect(() => {
      setValue("cod_usuario", usuario?.cod_usuario);
      setValue("cod_empresa", usuario?.cod_empresa);
      watch((value) => {
         const { cep_aluno } = value;

         if (cep_aluno?.length === 8) {
            if (cepAtual === cep_aluno) return;
            cepAtual = cep_aluno;
            fetch(`https://viacep.com.br/ws/${cep_aluno}/json/`)
               .then((resp) => {
                  if (!resp.ok) {
                     throw new Error("Erro ao buscar informações do CEP.");
                  }
                  return resp.json(); // Extrai o corpo da resposta em formato JSON
               })
               .then((data) => {
                  if (data.logradouro) setValue("endereco_aluno", data.logradouro);
                  if (data.uf) setValue("estado_aluno", data.uf);
                  if (data.localidade) setValue("cidade_aluno", data.localidade);
                  if (data.bairro) setValue("bairro_aluno", data.bairro);
                  if (data.complemento) setValue("complemento_aluno", data.complemento);
                  if (data.cep) setValue("cep_aluno", data.cep);
               })
               .catch((error) => {
                  console.error("Erro:", error.message);
               });
         }
      });
   }, [watch, usuario]);

   useEffect(() => {
      if (alunoRecebido) {
         Object.keys(alunoRecebido).forEach((key) => {
            setValue(key, alunoRecebido[key]);
         });
      } else {
         Object.keys(formData.aluno).forEach((key) => {
            setValue(key, formData.aluno[key]);
         });
      }
   }, [alunoRecebido, setValue]);

   const watched = watch();
   useEffect(() => {
      if (watched?.cod_aluno) return;
      setAlunoForm(watched);
   }, [JSON.stringify(watched)]);

   async function confirma(data) {
      await createOrUpdateStudent(limpaForm(data));
      clearForm();
      nSuccess();
      navigate("/aluno", { state: { cod_aluno: data.cod_aluno } });
   }

   return (
      <div className="container-fluid">
         <BackBoxUI />

         <Card>
            <CardContent>
               <FormProvider {...form}>
                  <form onSubmit={handleSubmit(confirma)}>
                     <FitFormUI
                        errors={errors}
                        fields={[
                           {
                              title: "Informações pessoais",
                              cols: 4,
                              fields: [
                                 {
                                    id: "name",
                                    label: "Nome",
                                    fieldName: "nome_aluno",
                                    options: {
                                       required: true,
                                       minLength: 5,
                                    },
                                 },
                                 {
                                    format: "documentId",
                                    id: "cpf",
                                    label: "CPF",
                                    fieldName: "cpf_aluno",
                                    description: "Necessário para contratação de plano",
                                    inputType: "number",
                                 },
                                 {
                                    id: "rg",
                                    label: "RG",
                                    fieldName: "rg_aluno",
                                    description: "Necessário para contratação de plano",
                                    inputType: "number",
                                 },
                                 {
                                    type: "phone",
                                    id: "phone",
                                    label: "Telefone",
                                    fieldName: "telefone_aluno",
                                    description: "Necessário para contratação de plano",
                                    options: {
                                       required: true,
                                    },
                                 },
                              ],
                           },
                           {
                              separator: true,
                              cols: 4,
                              fields: [
                                 {
                                    id: "birthdate",
                                    label: "Data de nascimento",
                                    fieldName: "data_nascimento_aluno",
                                    inputType: "date",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    id: "gender",
                                    label: "Sexo",
                                    fieldName: "sexo_aluno",
                                    type: "select",
                                    selectOptions: [
                                       { label: "Masculino", value: "M" },
                                       { label: "Feminino", value: "F" },
                                    ],
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    id: "ethnicity",
                                    label: "Etnia",
                                    fieldName: "etnia_aluno",
                                    type: "select",
                                    selectOptions: [
                                       { label: "Caucasiano", value: "Caucasiano" },
                                       { label: "Negro", value: "Negro" },
                                       { label: "Asiático", value: "Asiático" },
                                    ],
                                    options: {
                                       required: true,
                                    },
                                 },
                              ],
                           },
                           {
                              title: "FitCpx - Aluno",
                              separator: true,
                              fields: [
                                 {
                                    id: "email",
                                    label: "E-mail",
                                    fieldName: "email_aluno",
                                    inputType: "email",
                                    description: "O aluno usará para acessar o app do aluno",
                                    options: {
                                       required: true,
                                       minLength: 5,
                                    },
                                 },
                                 {
                                    id: "senha",
                                    label: "Senha",
                                    fieldName: "senha_aluno",
                                    description: "O aluno define a senha no primeiro acesso",
                                    options: {
                                       disabled: true,
                                    },
                                    inputType: "password",
                                 },
                              ],
                           },
                           {
                              title: "Endereço",
                              cols: 4,
                              fields: [
                                 {
                                    format: "CEP",
                                    id: "cep",
                                    label: "CEP",
                                    type: "number",
                                    fieldName: "cep_aluno",
                                 },
                                 {
                                    id: "state",
                                    label: "Estado",
                                    fieldName: "estado_aluno",
                                    type: "select",
                                    selectOptions: states,
                                 },
                                 {
                                    id: "city",
                                    label: "Cidade",
                                    fieldName: "cidade_aluno",
                                 },
                                 {
                                    id: "neighborhood",
                                    label: "Bairro",
                                    fieldName: "bairro_aluno",
                                 },
                              ],
                           },
                           {
                              cols: 4,
                              separator: true,
                              fields: [
                                 {
                                    id: "address",
                                    label: "Endereço",
                                    fieldName: "endereco_aluno",
                                 },
                                 {
                                    id: "address2",
                                    label: "Complemento",
                                    fieldName: "complemento_aluno",
                                 },
                                 {
                                    id: "number",
                                    label: "Número",
                                    fieldName: "numero_aluno",
                                    type: "number",
                                 },
                              ],
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

export default CadAluno;
