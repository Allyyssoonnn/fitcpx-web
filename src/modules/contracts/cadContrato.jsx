import JoditEditor from "jodit-react";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateContractTemplate } from "../../api/contractsTemplates";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { stateUsuario, useNotificacao } from "../../states/states";
import academiaOnline from "./templates/academia-online.template.html?raw";
import academiaPresencial from "./templates/academia-presencial.template.html?raw";
import personalOnline from "./templates/personal-online.template.html?raw";
import personalPresencial from "./templates/personal-presencial.template.html?raw";

function CadContrato() {
   const location = useLocation();
   const contratoRecebido = location.state?.contrato;
   const editor = useRef(null);
   const { nSuccess, nConfirm } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);
   const form = useForm({ defaultValues: contratoRecebido });
   const {
      handleSubmit,
      setValue,
      formState: { errors },
   } = form;
   const navigate = useNavigate();
   const [contratohtml, setContratohtml] = useState("");

   useEffect(() => {
      if (contratoRecebido?.contrato) setContratohtml(contratoRecebido.contrato);
      if (contratoRecebido) {
         Object.keys(contratoRecebido).forEach((key) => {
            setValue(key, contratoRecebido[key]);
         });
      }
   }, [location, setValue, usuario]);

   async function confirma(data) {
      await createOrUpdateContractTemplate({ ...data, cod_empresa: usuario.cod_empresa, contrato: contratohtml });
      nSuccess();
      navigate("/modcontratos");
   }

   function setModeloContrato(e, modelo) {
      if (contratohtml) {
         nConfirm("", "As alterações no editor de contrato serão perdidas!", () => setContratohtml(modelo));
      } else setContratohtml(modelo);
   }

   return (
      <FormProvider {...form}>
         <form onSubmit={handleSubmit(confirma)} className="container-fluid">
            <BackBoxUI />

            <Card>
               <CardContent>
                  <FitFormUI
                     errors={errors}
                     fields={[
                        {
                           title: "Informações",
                           cols: 4,
                           fields: [
                              {
                                 label: "Nome",
                                 fieldName: "nome_contrato",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 label: "Multa Compensatória",
                                 fieldName: "multa_compensatoria",
                                 inputType: "number",
                              },
                              {
                                 label: "Multa Moratória",
                                 fieldName: "multa_moratoria",
                                 inputType: "number",
                              },
                              {
                                 label: "Juros ao mês",
                                 fieldName: "juros_atraso",
                                 inputType: "number",
                              },
                           ],
                        },
                     ]}
                  />
               </CardContent>
            </Card>

            <Card className="mt-3">
               <CardHeader className="flex justify-between">
                  <div>
                     <CardTitle>Contrato</CardTitle>
                     <CardDescription>
                        Modelos de contrato que será usado para composição do acordo de venda
                     </CardDescription>
                  </div>

                  <DropdownMenu>
                     <DropdownMenuTrigger>
                        <Button variant="outline">Modelos prontos</Button>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent>
                        {[
                           { label: "Academia Presencial", template: academiaPresencial },
                           { label: "Academia Online", template: academiaOnline },
                           { label: "Personal Presencial", template: personalPresencial },
                           { label: "Personal Online", template: personalOnline },
                        ].map((m, index) => (
                           <DropdownMenuItem key={index} onClick={(e) => setModeloContrato(e, m.template)}>
                              {m.label}
                           </DropdownMenuItem>
                        ))}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </CardHeader>

               <CardContent>
                  <JoditEditor
                     ref={editor}
                     value={contratohtml}
                     onBlur={(newContent) => setContratohtml(newContent)} // Atualiza quando perde o foco
                     config={{
                        readonly: false,
                        // height: 900,
                        // buttons: "bold,italic,underline,|,ul,ol,|,font,fontsize,brush,|,link,align,undo,redo",
                        // buttons: "source,|,bold,italic,underline,strikethrough,|,ul,ol,indent,outdent,|,left,center,right,justify,|,font,fontsize,brush,paragraph,|,table,|,hr,undo,redo,selectall,cut,copy,paste,|",
                        buttons:
                           "bold,italic,underline,strikethrough,|,ul,ol,indent,outdent,|,left,center,right,justify,|,font,fontsize,brush,paragraph,|,table,|,hr,undo,redo,selectall",
                        extraButtons: [
                           {
                              name: "Nome do aluno",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;nome_aluno&gt;"),
                              tooltip: "Inserir nome do aluno",
                           },
                           {
                              name: "RG do aluno",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;rg_aluno&gt;"),
                              tooltip: "Inserir RG do aluno",
                           },
                           {
                              name: "CPF do aluno",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;cpf_aluno&gt;"),
                              tooltip: "Inserir CPF do aluno",
                           },
                           {
                              name: "Endereço do aluno",
                              icon: "user",
                              exec: (editor) => {
                                 editor.selection.insertHTML(
                                    "&lt;endereco_aluno&gt;, nº &lt;numero_aluno&gt;, bairro &lt;bairro_aluno&gt;, CEP &lt;cep_aluno&gt;, na cidade &lt;cidade_aluno&gt;, estado &lt;estado_aluno&gt;"
                                 );
                              },
                              tooltip: "Inserir endereço do aluno",
                           },
                           {
                              name: "Nome da empresa",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;nome_empresa&gt;"),
                              tooltip: "Inserir nome do aluno",
                           },
                           {
                              name: "Razão social da empresa",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;razao_social_empresa&gt;"),
                              tooltip: "Inserir RG do aluno",
                           },
                           {
                              name: "CNPJ/CPF da empresa",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;doc_empresa&gt;"),
                              tooltip: "Inserir CPF do aluno",
                           },
                           {
                              name: "Endereço da empresa",
                              icon: "user",
                              exec: (editor) => {
                                 editor.selection.insertHTML(
                                    "&lt;endereco_empresa&gt;, nº &lt;numero_empresa&gt;, bairro &lt;bairro_empresa&gt;, CEP &lt;cep_empresa&gt;, na cidade &lt;cidade_empresa&gt;, estado &lt;estado_empresa&gt;"
                                 );
                              },
                              tooltip: "Inserir endereço do aluno",
                           },
                           {
                              name: "R$ contrato",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;valor_total&gt;"),
                              tooltip: "Inserir valor total do contrato",
                           },
                           {
                              name: "R$ mensal",
                              icon: "user",
                              exec: (editor) => editor.selection.insertHTML("&lt;valor_mensal&gt;"),
                              tooltip: "Inserir valores mensais do contrato",
                           },
                        ],
                     }}
                  />

                  <div className="d-flex justify-end mt-3">
                     <Button id="submit" type="submit">
                        <Check />
                        Confirmar
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </form>
      </FormProvider>
   );
}

export default CadContrato;
