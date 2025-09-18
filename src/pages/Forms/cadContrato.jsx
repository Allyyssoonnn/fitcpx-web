import JoditEditor from "jodit-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateContractTemplate } from "../../api/contractsTemplates";
import { stateUsuario, useNotificacao } from "../../states/states";
import contratoConsultoria from "../../utils/contratoConsultoria.html?raw";
import contratoPresencial from "../../utils/contratoPresencial.html?raw";

function CadContrato() {
   const editor = useRef(null);
   const { nSuccess, nConfirm } = useNotificacao();
   const [usuario] = useRecoilState(stateUsuario);
   const { register, handleSubmit, control, setValue } = useForm();
   const navigate = useNavigate();
   const location = useLocation();
   const [contratohtml, setContratohtml] = useState("");

   useEffect(() => {
      const contratoRecebido = location.state?.contrato;
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
      e.preventDefault();
      if (contratohtml) {
         nConfirm("", "As alterações no editor de contrato serão perdidas!", () => setContratohtml(modelo));
      } else setContratohtml(modelo);
   }

   return (
      <form onSubmit={handleSubmit(confirma)} className="container-fluid">
         <div className="card">
            <div className="card-header">
               <button
                  onClick={(e) => {
                     e.stopPropagation();
                     navigate("/modcontratos");
                  }}
                  className="btn btn-danger mb-3 me-3"
               >
                  <i className="bi bi-backspace me-2"></i>
                  Voltar
               </button>
            </div>

            <div className="card-body">
               <h5 className="card-title fw-semibold mb-4">Informações</h5>

               <div className="row g-3">
                  <div className="col-md-5">
                     <label className="form-label fw-bold">Nome *</label>
                     <input
                        {...register("nome_contrato", { required: "O nome é obrigatório" })}
                        className="form-control"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="card">
            <div className="card-body">
               <div className="card-header d-flex justify-content-between">
                  <h5 className="card-title fw-semibold mb-4">Contrato</h5>
                  <div className="d-flex gap-2 align-items-center">
                     <button
                        className="btn btn-sm btn-info rounded"
                        onClick={(e) => setModeloContrato(e, contratoPresencial)}
                     >
                        Modelo presencial
                     </button>
                     <button
                        className="btn btn-sm btn-info rounded"
                        onClick={(e) => setModeloContrato(e, contratoConsultoria)}
                     >
                        Modelo consultoria
                     </button>
                  </div>
               </div>

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
                        "bold,italic,underline,strikethrough,|,ul,ol,indent,outdent,|,left,center,right,justify,|,font,fontsize,brush,paragraph,|,table,|,hr,undo,redo,selectall,cut,copy,paste",
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
            </div>

            <div className="card-footer">
               <button type="submit" className="btn btn-success">
                  Confirmar
               </button>
            </div>
         </div>
      </form>
   );
}

export default CadContrato;
