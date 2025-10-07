import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import { useRecoilState } from "recoil";
import { getServices } from "../api/services";
import { stateUsuario } from "../states/states";
import { formatarMoeda } from "../utils";
import Select from "./baseComponents/select";
import EditableCurrency from "./editableCurrency";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

function SelectModalidades({
   modalidadesPlano,
   attValue,
   addModalidade,
   removeModalidade,
   allowSubVariacao = true,
   disableControls = false,
}) {
   const [usuario] = useRecoilState(stateUsuario);
   const [modalModalidade, setModalModalidade] = useState(false);

   const { data: modalidades } = useQuery({
      queryKey: ["modalidades", usuario.cod_empresa],
      queryFn: getServices,
      initialData: [],
   });

   function openModalidade(e) {
      e.preventDefault();
      setModalModalidade(true);
   }

   return (
      <div className="d-flex flex-column">
         <ModalModalidades
            modalidades={modalidades}
            show={modalModalidade}
            setShow={setModalModalidade}
            addModalidade={addModalidade}
            allowSubVariacao={allowSubVariacao}
         />
         {!disableControls && (
            <Button variant="outline" onClick={openModalidade}>
               <PlusCircle />
               Adicionar modalidade
            </Button>
         )}

         <h5 className="card-title fs-3 mt-3">Modalidades</h5>

         <Table>
            <TableHeader>
               <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Valor</TableCell>
               </TableRow>
            </TableHeader>

            <TableBody>
               {modalidadesPlano?.map((modalidade, index) => (
                  <TableRow key={index}>
                     <TableCell>{modalidade.nome_modalidade}</TableCell>
                     {attValue && !disableControls ? (
                        <TableCell>
                           <EditableCurrency
                              value={modalidade?.valor_modalidade || 0}
                              onUpdate={(v) => attValue(v, index)}
                           />
                        </TableCell>
                     ) : (
                        <TableCell>{formatarMoeda(modalidade?.valor_modalidade || 0)}</TableCell>
                     )}
                     {!disableControls && (
                        <TableCell>
                           <button className="btn btn-sm btn-outline-danger" onClick={() => removeModalidade(index)}>
                              <i className="bi bi-trash" />
                           </button>
                        </TableCell>
                     )}
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}

function ModalModalidades({ show, setShow, modalidades, addModalidade, allowSubVariacao }) {
   const [modalidade, setModalidade] = useState(null);
   const [variacao, setVariacao] = useState();
   const [quantidade, setQuantidade] = useState(1);

   function confirmar() {
      addModalidade({
         ...modalidade,
         quantidade_modalidade: quantidade,
         cod_modalidade_variacao: variacao ? variacao.cod_modalidade_variacao : 1,
         valor_modalidade: variacao ? variacao.valor_modalidade_variacao : modalidade.valor_modalidade,
         valor_modalidade_original: variacao ? variacao.valor_modalidade_variacao : modalidade.valor_modalidade,
         nome_modalidade: `${modalidade.nome_modalidade} ${variacao ? ` - ${variacao.nome_modalidade_variacao}` : ""}`,
         nome_modalidade_original: `${modalidade.nome_modalidade} ${
            variacao ? ` - ${variacao.nome_modalidade_variacao}` : ""
         }`,
         valores: variacao?.valores ?? [],
      });
      setShow(false);
   }

   function fechar() {
      setModalidade(null);
      setVariacao(null);
      setShow(false);
   }

   return (
      <Modal show={show}>
         <div className="card">
            <div className="card-header">
               <h5 className="card-title">Incluir modalidade</h5>
            </div>

            <div className="card-body">
               <Select
                  options={modalidades}
                  value={modalidade?.cod_modalidade}
                  fieldName="nome_modalidade"
                  fieldValue="cod_modalidade"
                  label="Selecionar modalidade"
                  onChange={(value) => setModalidade(value)}
               />

               {!allowSubVariacao && (
                  <div className="mt-3">
                     <label className="form-label">Quantidade</label>
                     <input
                        className="form-control"
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                     />
                  </div>
               )}

               <div className="mt-3">
                  {modalidade?.variacoes && allowSubVariacao && (
                     <Select
                        options={modalidade?.variacoes}
                        fieldName="nome_modalidade_variacao"
                        fieldValue="nome_modalidade_variacao"
                        label="Selecionar variação"
                        onChange={(value) => setVariacao(value)}
                     />
                  )}
               </div>

               <div className="d-flex justify-content-center mt-3">
                  <label className="badge bg-info w-100 fs-5">
                     {formatarMoeda((variacao?.valor_modalidade_variacao ?? modalidade?.valor_modalidade) || 0)}
                  </label>
               </div>
            </div>

            <div className="card-footer d-flex justify-content-between">
               <button className="btn btn-danger rounded" onClick={fechar}>
                  Fechar
               </button>
               <button className="btn btn-success rounded" onClick={confirmar} disabled={!modalidade}>
                  Confirmar
               </button>
            </div>
         </div>
      </Modal>
   );
}

export default SelectModalidades;
