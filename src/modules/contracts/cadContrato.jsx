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
   const { tSuccess, nConfirm } = useNotificacao();
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
      tSuccess();
      navigate("/modcontratos");
   }

   function setModeloContrato(e, modelo) {
      if (contratohtml) {
         nConfirm("", "As alterações no editor de contrato serão perdidas!", () => setContratohtml(modelo));
      } else setContratohtml(modelo);
   }

   function insertTagEditor(editor, tag) {
      return editor.selection.insertHTML(`<span style="background: aqua">${tag}</span>`);
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
                                 id: "name",
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
                     <DropdownMenuTrigger id="templatesDropdown">
                        <Button variant="outline">Modelos prontos</Button>
                     </DropdownMenuTrigger>

                     <DropdownMenuContent>
                        {[
                           { label: "Academia Presencial", template: academiaPresencial },
                           { label: "Academia Online", template: academiaOnline },
                           { label: "Personal Presencial", template: personalPresencial },
                           { label: "Personal Online", template: personalOnline },
                        ].map((m, index) => (
                           <DropdownMenuItem
                              key={index}
                              id={`templatesDropdown-${index}`}
                              onClick={(e) => setModeloContrato(e, m.template)}
                           >
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
                        events: {
                           keydown: (e) => {
                              if (e.key === "<" || e.key === ">") {
                                 e.preventDefault();
                                 return false;
                              }
                           },

                           beforeInsertText: (text) => {
                              if (!text) return text;
                              return text.replace(/[<>]/g, "");
                           },

                           beforePaste: (e) => {
                              e.preventDefault();
                              const text = e.clipboardData?.getData("text/plain") ?? "";
                              return text.replace(/[<>]/g, "");
                           },
                        },

                        readonly: false,
                        // height: 900,
                        // buttons: "bold,italic,underline,|,ul,ol,|,font,fontsize,brush,|,link,align,undo,redo",
                        // buttons: "source,|,bold,italic,underline,strikethrough,|,ul,ol,indent,outdent,|,left,center,right,justify,|,font,fontsize,brush,paragraph,|,table,|,hr,undo,redo,selectall,cut,copy,paste,|",
                        buttons:
                           "bold,italic,underline,strikethrough,|,ul,ol,indent,outdent,|,left,center,right,justify,|,font,fontsize,brush,paragraph,|,table,|,hr,undo,redo,selectall",
                        extraButtons: [
                           {
                              name: "Tempo de contrato",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;tempo_contrato&gt;"),
                              tooltip: "Inserir tempo de contrato",
                           },
                           {
                              name: "Valor total do plano",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;valor_total_plano&gt;"),
                              tooltip: "Inserir valor total do plano",
                           },
                           {
                              name: "Valor mensal",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;valor_mensal_unitario&gt;"),
                              tooltip: "Inserir Valor mensal",
                           },
                           {
                              name: "Multa moratória %",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;multa_percentagem&gt;"),
                              tooltip: "Inserir % de multa moratória",
                           },
                           {
                              name: "Juros ao mês % (Atraso)",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;juros_percentagem&gt;"),
                              tooltip: "Inserir % de juros ao mês (atraso)",
                           },
                           {
                              name: "Multa compensatória %",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;percentagem_multa&gt;"),
                              tooltip: "Inserir % de multa compensatória",
                           },
                           {
                              name: "Nome do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;nome_aluno&gt;"),
                              tooltip: "Inserir nome do aluno",
                           },
                           {
                              name: "CPF do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;cpf_aluno&gt;"),
                              tooltip: "Inserir CPF do aluno",
                           },
                           {
                              name: "RG do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;rg_aluno&gt;"),
                              tooltip: "Inserir RG do aluno",
                           },
                           {
                              name: "E-mail do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;email_aluno&gt;"),
                              tooltip: "Inserir E-mail do aluno",
                           },
                           {
                              name: "Endereço do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;endereco_aluno&gt;"),
                              tooltip: "Inserir Endereço do aluno",
                           },
                           {
                              name: "Cidade do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;cidade_aluno&gt;"),
                              tooltip: "Inserir Cidade do aluno",
                           },
                           {
                              name: "Estado do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;estado_aluno&gt;"),
                              tooltip: "Inserir Estado do aluno",
                           },
                           {
                              name: "Número (endereço) do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;numero_aluno&gt;"),
                              tooltip: "Inserir número do endereço do aluno",
                           },
                           {
                              name: "CEP do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;cep_aluno&gt;"),
                              tooltip: "Inserir CEP do aluno",
                           },
                           {
                              name: "Bairro do aluno",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;bairro_aluno&gt;"),
                              tooltip: "Inserir Bairro do aluno",
                           },
                           {
                              name: "Nome do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;nome_empresa&gt;"),
                              tooltip: "Inserir nome do profissional",
                           },
                           {
                              name: "CNPJ/CPF do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;doc_empresa&gt;"),
                              tooltip: "Inserir CNPJ/CPF do profissional",
                           },
                           {
                              name: "Endereço do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;endereco_empresa&gt;"),
                              tooltip: "Inserir Endereço do profissional",
                           },
                           {
                              name: "Cidade do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;cidade_empresa&gt;"),
                              tooltip: "Inserir Cidade do profissional",
                           },
                           {
                              name: "Estado do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;estado_empresa&gt;"),
                              tooltip: "Inserir Estado do profissional",
                           },
                           {
                              name: "Número (endereço) do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;numero_empresa&gt;"),
                              tooltip: "Inserir número do endereço do profissional",
                           },
                           {
                              name: "CEP do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;cep_empresa&gt;"),
                              tooltip: "Inserir CEP do profissional",
                           },
                           {
                              name: "Bairro do profissional",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;bairro_empresa&gt;"),
                              tooltip: "Inserir Bairro do profissional",
                           },
                           {
                              name: "Modalidades/Serviços do plano",
                              icon: "user",
                              exec: (editor) => insertTagEditor(editor, "&lt;modalidade&gt;"),
                              tooltip: "Inserir modalidades/serviços do plano",
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
