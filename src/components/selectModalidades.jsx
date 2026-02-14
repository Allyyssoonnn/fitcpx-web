import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getServices } from "../api/services";
import { stateUsuario } from "../states/states";
import { formatarMoeda } from "../utils";
import EditableCurrency from "./editableCurrency";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "./ui/table";

function SelectModalidades({
   modalidadesPlano = [],
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
            <Button variant="outline" onClick={openModalidade} className="mb-3">
               <PlusCircle />
               Adicionar modalidade
            </Button>
         )}

         <h5 className="card-title fs-3">Modalidades</h5>

         <div className="rounded-md border mt-4">
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
                              <button
                                 className="btn btn-sm btn-outline-danger"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    removeModalidade(index);
                                 }}
                              >
                                 <i className="bi bi-trash" />
                              </button>
                           </TableCell>
                        )}
                     </TableRow>
                  ))}
                  {modalidadesPlano?.length == 0 && (
                     <TableRow>
                        <TableCell colSpan={3} className="text-center h-40">
                           Nenhuma modalidade selecionada
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
function ModalModalidades({ show, setShow, modalidades, addModalidade }) {
   const [modalidade, setModalidade] = useState(undefined);
   const [codModalidade, setCodModalidade] = useState("");
   const [codVariacao, setCodVariacao] = useState("");

   // Atualiza a modalidade selecionada
   useEffect(() => {
      if (codModalidade) {
         const mod = modalidades?.find((m) => String(m.cod_modalidade) === codModalidade);
         setModalidade(mod);
         setCodVariacao(""); // resetar variação ao trocar modalidade
      } else {
         setModalidade(undefined);
      }
   }, [codModalidade, modalidades]);

   // Obtém a variação selecionada
   const variacao = modalidade?.variacoes?.find((v) => String(v.cod_modalidade_variacao) === codVariacao);

   function confirmar() {
      if (!modalidade) return;

      addModalidade({
         ...modalidade,
         quantidade_modalidade: 1,
         cod_modalidade_variacao: variacao?.cod_modalidade_variacao,
         valor_modalidade: variacao?.valor_modalidade_variacao ?? modalidade.valor_modalidade ?? 0,
         valor_modalidade_original: variacao?.valor_modalidade_variacao ?? modalidade.valor_modalidade ?? 0,
         nome_modalidade: `${modalidade.nome_modalidade}${variacao ? ` - ${variacao.nome_modalidade_variacao}` : ""}`,
         nome_modalidade_original: modalidade.nome_modalidade,
         valores: variacao?.valores ?? [],
      });

      fechar();
   }

   function fechar() {
      setModalidade(undefined);
      setCodModalidade("");
      setCodVariacao("");
      setShow(false);
   }

   // Valor a ser exibido
   const valorExibicao = variacao?.valor_modalidade_variacao ?? modalidade?.valor_modalidade ?? 0;

   return (
      <Dialog open={show} onOpenChange={fechar}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>Incluir Modalidade</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
               {/* Seleção da modalidade */}
               <Select value={codModalidade} onValueChange={setCodModalidade}>
                  <SelectTrigger className="w-100 mb-3">
                     <SelectValue placeholder="Selecione a modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                     {modalidades?.map((m) => (
                        <SelectItem value={String(m.cod_modalidade)} key={m.cod_modalidade}>
                           {m.nome_modalidade}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>

               {/* Seleção da variação */}
               {modalidade?.variacoes?.length > 0 && (
                  <Select value={codVariacao} onValueChange={setCodVariacao}>
                     <SelectTrigger className="w-100 mb-3">
                        <SelectValue placeholder="Selecione a variação" />
                     </SelectTrigger>
                     <SelectContent>
                        {modalidade.variacoes.map((v) => (
                           <SelectItem value={String(v.cod_modalidade_variacao)} key={v.cod_modalidade_variacao}>
                              {v.nome_modalidade_variacao}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               )}

               {/* Exibição do valor */}
               <div className="flex justify-center">
                  <span className="bg-gray-200 text-gray-900 text-lg px-4 py-2 rounded w-full text-center">
                     {formatarMoeda(valorExibicao)}
                  </span>
               </div>
            </div>

            <DialogFooter>
               <Button onClick={confirmar} disabled={!modalidade}>
                  Confirmar
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

export default SelectModalidades;
