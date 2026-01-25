import { AlertCircle, Check, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { createOrUpdateService } from "../../api/services";
import { getUsers } from "../../api/user";
import FitInputCurrency from "../../components/baseComponents/FitInputCurrency";
import FitInputForm from "../../components/baseComponents/FitInputForm";
import FitSelectForm from "../../components/baseComponents/FitSelectForm";
import BackBoxUI from "../../components/fitUI/backBox.ui";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { stateEmpresa, stateUsuario, useNotificacao } from "../../states/states";
import { formatarMoeda } from "../../utils";

function CadModalidade() {
   const location = useLocation();
   const modalidadeRecebido = location.state?.modalidade;
   const { tSuccess } = useNotificacao();
   const [empresa] = useRecoilState(stateEmpresa);
   const [usuario] = useRecoilState(stateUsuario);
   const form = useForm({ defaultValues: modalidadeRecebido });
   const {
      handleSubmit,
      setValue,
      formState: { errors },
   } = form;
   const navigate = useNavigate();
   const [modalVariacao, setModalVariacao] = useState(false);
   const [modalSubVariacao, setModalSubVariacao] = useState(false);
   const [modalComissao, setModalComissao] = useState(false);
   const [variacoes, setVariacoes] = useState([]);
   const [indexVariacao, setIndexVariacao] = useState(-1);
   const [comissao, setComissao] = useState({});

   useEffect(() => {
      if (modalidadeRecebido?.variacoes) setVariacoes(modalidadeRecebido?.variacoes);
      if (modalidadeRecebido?.comissao_modalidade) setComissao(JSON.parse(modalidadeRecebido.comissao_modalidade));
      if (modalidadeRecebido) {
         Object.keys(modalidadeRecebido).forEach((key) => {
            setValue(key, modalidadeRecebido[key]);
         });
      }
   }, [location, setValue, usuario]);

   async function confirma(data) {
      const jsonComisao = comissao?.cod_usuario ? JSON.stringify(comissao) : null;
      await createOrUpdateService({
         ...data,
         comissao_modalidade: jsonComisao,
         variacoes,
         cod_usuario: usuario.cod_usuario,
         cod_empresa: usuario.cod_empresa,
      });
      tSuccess();
      navigate("/modalidades");
   }

   function addPreco(e) {
      e.preventDefault();
      setModalVariacao(true);
   }

   function addComissao(e) {
      e.preventDefault();
      setModalComissao(true);
   }

   function addSubVariacao(e) {
      e.preventDefault();
      setModalSubVariacao(true);
   }

   const newComissao = (data) => setComissao(data);
   const newVariacao = (data) => setVariacoes((prev) => [...prev, { ...data, valores: [] }]);

   const newDescont = (data) => {
      setVariacoes((prevState) =>
         prevState.map((v, i) =>
            indexVariacao == i ? { ...v, valores: Array.isArray(v.valores) ? [...v.valores, data] : [data] } : v,
         ),
      );
   };

   function removeVariacao(e, index) {
      e.preventDefault();
      setVariacoes((prev) => prev.filter((v, i) => index !== i));
   }

   function removeComissao(e) {
      e.preventDefault();
      setComissao(null);
   }

   function removeSubVariacao(e, index) {
      e.preventDefault();
      setVariacoes((prevState) =>
         prevState.map((v, i) =>
            indexVariacao == i
               ? { ...v, valores: Array.isArray(v.valores) ? v.valores.filter((s, iSub) => iSub !== index) : [] }
               : v,
         ),
      );
   }

   function applyDescont(e, index) {
      e.preventDefault();
      setIndexVariacao(index);
   }

   return (
      <div className="container-fluid">
         <BackBoxUI />

         <ModalVariacao show={modalVariacao} setShow={setModalVariacao} newVariacao={newVariacao} />
         <ModalSubVariacao show={modalSubVariacao} setShow={setModalSubVariacao} newDescont={newDescont} />
         <ModalComissao show={modalComissao} setShow={setModalComissao} newComissao={newComissao} />

         <FormProvider {...form}>
            <form onSubmit={handleSubmit(confirma)}>
               <Card>
                  <CardContent>
                     <FitFormUI
                        errors={errors}
                        fields={[
                           {
                              title: "Informações",
                              fields: [
                                 {
                                    id: "name",
                                    label: "Nome",
                                    fieldName: "nome_modalidade",
                                    options: {
                                       required: true,
                                    },
                                 },
                                 {
                                    id: "value",
                                    label: "Valor",
                                    fieldName: "valor_modalidade",
                                    type: "currency",
                                 },
                              ],
                           },
                           {
                              cols: 5,
                              fields: [
                                 {
                                    label: "Cor",
                                    fieldName: "cor_modalidade",
                                    type: "color",
                                    description: "Marcação da agenda",
                                 },
                                 {
                                    label: "Descrição",
                                    fieldName: "descricao_modalidade",
                                    colSpan: 3,
                                 },
                              ],
                           },
                        ]}
                     />
                  </CardContent>
               </Card>

               <Card className="mt-3">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <div className="space-y-1">
                        <CardTitle>Configuração de Repasse</CardTitle>
                        <CardDescription>Defina a divisão de valores entre empresa e profissional</CardDescription>
                     </div>
                     <Button variant="outline" size="sm" onClick={addComissao}>
                        <PlusCircle />
                        Adicionar
                     </Button>
                  </CardHeader>

                  <CardContent>
                     <div className="rounded-md border mt-4">
                        <Table>
                           <TableHeader>
                              <TableRow>
                                 <TableHead>Beneficiário</TableHead>
                                 <TableHead className="text-right">Participação (%)</TableHead>
                                 <TableHead className="w-[100px]"></TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              <TableRow>
                                 <TableCell className="font-medium">
                                    {empresa?.nome_empresa}{" "}
                                    <Badge variant="secondary" className="ml-2">
                                       Empresa
                                    </Badge>
                                 </TableCell>
                                 <TableCell className="text-right font-bold text-green-600">
                                    {100 - (comissao?.porcentagem_usuario || 0)}%
                                 </TableCell>
                                 <TableCell></TableCell>
                              </TableRow>
                              {comissao?.cod_usuario && (
                                 <TableRow>
                                    <TableCell className="font-medium">
                                       {comissao.nome_usuario}{" "}
                                       <Badge variant="default" className="ml-2">
                                          Profissional
                                       </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-blue-600">
                                       {comissao.porcentagem_usuario}%
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <Button
                                          size="icon"
                                          variant="ghost"
                                          className="text-destructive hover:bg-destructive/10"
                                          onClick={(e) => {
                                             e.preventDefault();
                                             removeComissao(e);
                                          }}
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </Button>
                                    </TableCell>
                                 </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </div>
                     <p className="text-muted-foreground mt-2 text-xs italic flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Alterações afetam contratos em andamento automaticamente.
                     </p>
                  </CardContent>
               </Card>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <div>
                     <Card className="mt-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <div className="space-y-1">
                              <CardTitle>Variações de Plano</CardTitle>
                              <CardDescription>Mensal, Semestral, etc.</CardDescription>
                           </div>
                           <Button variant="outline" size="sm" onClick={addPreco} id="newVarService">
                              <PlusCircle />
                              Adicionar
                           </Button>
                        </CardHeader>

                        <CardContent className="flex-1">
                           {variacoes.length === 0 ? (
                              <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-md text-muted-foreground text-sm">
                                 Nenhuma variação cadastrada.
                              </div>
                           ) : (
                              <div className="rounded-md border">
                                 <Table>
                                    <TableHeader>
                                       <TableRow>
                                          <TableHead>Nome</TableHead>
                                          <TableHead>Valor</TableHead>
                                          <TableHead className="text-right">Ações</TableHead>
                                       </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                       {variacoes.map((variacao, index) => (
                                          <TableRow
                                             key={index}
                                             className={indexVariacao === index ? "bg-muted/50" : ""}
                                          >
                                             <TableCell className="font-medium">
                                                {variacao.nome_modalidade_variacao}
                                             </TableCell>
                                             <TableCell>
                                                {formatarMoeda(variacao?.valor_modalidade_variacao || 0)}
                                             </TableCell>
                                             <TableCell className="text-right flex justify-end gap-2">
                                                <Button
                                                   size="sm"
                                                   variant={indexVariacao === index ? "default" : "secondary"}
                                                   onClick={(e) => applyDescont(e, index)}
                                                >
                                                   Configurar
                                                </Button>
                                                <Button
                                                   size="icon"
                                                   variant="ghost"
                                                   className="text-destructive hover:bg-destructive/10"
                                                   onClick={(e) => removeVariacao(e, index)}
                                                >
                                                   <Trash2 className="w-4 h-4" />
                                                </Button>
                                             </TableCell>
                                          </TableRow>
                                       ))}
                                    </TableBody>
                                 </Table>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  </div>

                  <div className={indexVariacao >= 0 ? "block" : "hidden lg:block lg:opacity-50 pointer-events-none"}>
                     <Card className="flex flex-col border-l-4 border-l-primary mt-3">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                           <div className="space-y-1">
                              <CardTitle>Escalonamento</CardTitle>
                              {indexVariacao >= 0 ? (
                                 <p className="text-sm font-medium text-primary">
                                    Editando: {variacoes[indexVariacao]?.nome_modalidade_variacao}
                                 </p>
                              ) : (
                                 <CardDescription>Selecione uma variação</CardDescription>
                              )}
                           </div>
                           {indexVariacao >= 0 && (
                              <Button variant="outline" size="sm" onClick={addSubVariacao}>
                                 <PlusCircle className="w-4 h-4 mr-2" />
                                 Adicionar
                              </Button>
                           )}
                        </CardHeader>

                        {indexVariacao >= 0 && (
                           <CardContent>
                              <div className="rounded-md border">
                                 <Table>
                                    <TableHeader>
                                       <TableRow>
                                          <TableHead>Descrição</TableHead>
                                          <TableHead className="text-center">Meses</TableHead>
                                          <TableHead>Valor</TableHead>
                                          <TableHead className="w-[50px]"></TableHead>
                                       </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                       {(!variacoes[indexVariacao]?.valores ||
                                          variacoes[indexVariacao]?.valores.length === 0) && (
                                          <TableRow>
                                             <TableCell
                                                colSpan={4}
                                                className="h-24 text-center text-muted-foreground text-sm"
                                             >
                                                Sem valores escalonados definidos.
                                             </TableCell>
                                          </TableRow>
                                       )}
                                       {variacoes[indexVariacao]?.valores?.map((valor, index) => (
                                          <TableRow key={index}>
                                             <TableCell>{valor.nome_modalidade_variacao_valor}</TableCell>
                                             <TableCell className="text-center">
                                                <Badge variant="outline">
                                                   {valor.quantidade_modalidade_variacao_valor}x
                                                </Badge>
                                             </TableCell>
                                             <TableCell className="font-bold">
                                                {formatarMoeda(valor?.valor_modalidade_variacao_valor || 0)}
                                             </TableCell>
                                             <TableCell>
                                                <Button
                                                   size="icon"
                                                   variant="ghost"
                                                   className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                   onClick={(e) => removeSubVariacao(e, index)}
                                                >
                                                   <Trash2 className="w-4 h-4" />
                                                </Button>
                                             </TableCell>
                                          </TableRow>
                                       ))}
                                    </TableBody>
                                 </Table>
                              </div>
                           </CardContent>
                        )}
                     </Card>
                  </div>
               </div>

               <Card className="mt-3">
                  <CardFooter className="flex justify-end">
                     <Button type="submit">
                        <Check />
                        Confirmar
                     </Button>
                  </CardFooter>
               </Card>
            </form>
         </FormProvider>
      </div>
   );
}

function ModalVariacao({ show, setShow, newVariacao }) {
   const { register, handleSubmit, control, reset } = useForm();

   function confirmar(data) {
      newVariacao(data);
      setShow(false);
      reset();
   }

   return (
      <Modal show={show}>
         <form className="card" onSubmit={handleSubmit(confirmar)}>
            <div className="card-header">
               <h5 className="card-title">Adicionar variação</h5>
            </div>

            <div className="card-body">
               <div>
                  <label className="form-label">Nome</label>
                  <input
                     id="nameVarService"
                     {...register("nome_modalidade_variacao", { required: "Nome obrigatório!" })}
                     className="form-control"
                  />
               </div>

               <div className="mt-3">
                  <label className="form-label">Valor</label>
                  <FitInputCurrency id="valueVarService" name="valor_modalidade_variacao" control={control} />
               </div>
            </div>

            <div className="card-footer d-flex justify-content-between">
               <button className="btn btn-danger rounded" onClick={() => setShow(false)}>
                  Fechar
               </button>

               <button id="submitVarService" type="submit" className="btn btn-success rounded">
                  Confirmar
               </button>
            </div>
         </form>
      </Modal>
   );
}

function ModalSubVariacao({ show, setShow, newDescont }) {
   const form = useForm();
   const {
      handleSubmit,
      reset,
      formState: { errors },
   } = form;

   function confirmar(data) {
      newDescont({
         nome_modalidade_variacao_valor:
            data.nome_modalidade_variacao_valor ?? `SubVariação ${String(data.quantidade_modalidade_variacao_valor)}`,
         quantidade_modalidade_variacao_valor: Number(data.quantidade_modalidade_variacao_valor ?? 1),
         valor_modalidade_variacao_valor: data.valor_modalidade_variacao_valor,
      });
      setShow(false);
      reset();
   }

   return (
      <Modal show={show}>
         <form className="card" onSubmit={handleSubmit(confirmar)}>
            <div className="card-header">
               <h5 className="card-title">Adicionar variação</h5>
            </div>

            <div className="card-body">
               <FormProvider {...form}>
                  <FitFormUI
                     errors={errors}
                     fields={[
                        {
                           cols: 1,
                           fields: [
                              {
                                 label: "Nome",
                                 fieldName: "nome_modalidade_variacao_valor",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 label: "Duração",
                                 fieldName: "quantidade_modalidade_variacao_valor",
                                 type: "number",
                                 options: {
                                    required: true,
                                 },
                              },
                              {
                                 label: "Valor",
                                 fieldName: "valor_modalidade_variacao_valor",
                                 type: "currency",
                                 options: {
                                    required: true,
                                 },
                              },
                           ],
                        },
                     ]}
                  />
               </FormProvider>
            </div>

            <div className="card-footer d-flex justify-content-between">
               <button className="btn btn-danger rounded" onClick={() => setShow(false)}>
                  Fechar
               </button>

               <button type="submit" className="btn btn-success rounded">
                  Confirmar
               </button>
            </div>
         </form>
      </Modal>
   );
}

function ModalComissao({ show, setShow, newComissao }) {
   const [usuario] = useRecoilState(stateUsuario);
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   const { data: usuarios, refetch } = useQuery({
      queryKey: ["usuarios", usuario.cod_usuario],
      queryFn: () => getUsers(usuario.cod_empresa),
      initialData: [],
      enabled: !!usuario.cod_empresa,
   });

   async function confirmar(data) {
      reset();
      const usuario = usuarios.find((user) => user.cod_usuario == data.cod_usuario);
      newComissao({ ...data, nome_usuario: usuario.nome_usuario });
      setShow(false);
   }

   return (
      <Modal show={show}>
         <form className="card" onSubmit={handleSubmit(confirmar)}>
            <div className="card-header">
               <h5 className="card-title">Adicionar conta de comissão</h5>
            </div>

            <div className="card-body">
               <FitSelectForm
                  nameField="Usuário"
                  textHelp="Apenas usuário com conta no FitCpx Pay está disponível"
                  errors={errors}
                  {...register("cod_usuario", { required: true })}
               >
                  {usuarios.map((user, index) => (
                     <option key={index} value={user.cod_usuario}>
                        {user.nome_usuario}
                     </option>
                  ))}
               </FitSelectForm>

               <FitInputForm
                  classNameContainer="mt-3"
                  type="number"
                  nameField="Porcentagem"
                  errors={errors}
                  {...register("porcentagem_usuario", { required: true, min: 1, max: 100 })}
               />
            </div>

            <div className="card-footer d-flex justify-content-between">
               <button className="btn btn-danger rounded" onClick={() => setShow(false)}>
                  Cancelar
               </button>
               <button className="btn btn-success rounded" type="submit">
                  Confirmar
               </button>
            </div>
         </form>
      </Modal>
   );
}

export default CadModalidade;
