import { Check } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateUser } from "../../api/user";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { stateUsuario, useNotificacao } from "../../states/states";
import { states } from "../../utils";

function CadUsuario() {
   const { nSuccess } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);
   const navigate = useNavigate();
   const location = useLocation();
   const usuarioRecebido = location.state?.usuario;
   const form = useForm({ defaultValues: usuarioRecebido });
   const {
      handleSubmit,
      setValue,
      watch,
      formState: { isSubmitting, errors },
   } = form;

   useEffect(() => {
      if (usuarioRecebido) {
         Object.keys(usuarioRecebido).forEach((key) => {
            setValue(key, usuarioRecebido[key]);
         });
      }
   }, [location, setValue, usuario]);

   let cepAtual = "";

   useEffect(() => {
      watch((value) => {
         const { cep_usuario } = value;

         if (cep_usuario?.length === 8) {
            if (cepAtual === cep_usuario) return;
            cepAtual = cep_usuario;
            fetch(`https://viacep.com.br/ws/${cep_usuario}/json/`)
               .then((resp) => {
                  if (!resp.ok) {
                     throw new Error("Erro ao buscar informações do CEP.");
                  }
                  return resp.json(); // Extrai o corpo da resposta em formato JSON
               })
               .then((data) => {
                  if (data.logradouro) setValue("endereco_usuario", data.logradouro);
                  if (data.uf) setValue("estado_usuario", data.uf);
                  if (data.localidade) setValue("cidade_usuario", data.localidade);
                  if (data.bairro) setValue("bairro_usuario", data.bairro);
                  if (data.complemento) setValue("complemento_usuario", data.complemento);
                  if (data.cep) setValue("cep_usuario", data.cep);
               })
               .catch((error) => {
                  console.error("Erro:", error.message);
               });
         }
      });
   }, [watch]);

   async function confirma(data) {
      await createOrUpdateUser({ ...data, cod_empresa: usuario.cod_empresa });
      nSuccess();
      navigate("/users");
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
                              separator: true,
                              title: "Informações pessoais",
                              cols: 4,
                              fields: [
                                 {
                                    label: "Nome",
                                    fieldName: "nome_usuario",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    id: "idnumber",
                                    label: "CPF",
                                    format: "documentId",
                                    fieldName: "cpf_usuario",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    type: "phone",
                                    id: "cellphone",
                                    label: "Celular",
                                    fieldName: "celular_usuario",
                                    description: "Necessário para contratação de plano",
                                    options: {
                                       required: true,
                                    },
                                 },
                              ],
                           },
                           {
                              separator: true,
                              title: "Acesso ao sistema",
                              cols: 4,
                              fields: [
                                 {
                                    label: "E-mail",
                                    fieldName: "email_usuario",
                                    inputType: "email",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    label: "Senha",
                                    fieldName: "senha_usuario",
                                    inputType: "password",
                                    options: {
                                       required: true,
                                    },
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
                                    fieldName: "cep_usuario",
                                 },
                                 {
                                    id: "state",
                                    label: "Estado",
                                    fieldName: "estado_usuario",
                                    type: "select",
                                    selectOptions: states,
                                 },
                                 {
                                    id: "city",
                                    label: "Cidade",
                                    fieldName: "cidade_usuario",
                                 },
                                 {
                                    id: "neighborhood",
                                    label: "Bairro",
                                    fieldName: "bairro_usuario",
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
                                    fieldName: "endereco_usuario",
                                 },
                                 {
                                    id: "address2",
                                    label: "Complemento",
                                    fieldName: "complemento_usuario",
                                 },
                                 {
                                    id: "number",
                                    label: "Número",
                                    fieldName: "numero_usuario",
                                    inputType: "number",
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

export default CadUsuario;
