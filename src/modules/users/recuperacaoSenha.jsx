import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { updatePasswordStudent } from "../../api/student";
import { updatePassword } from "../../api/user";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Field, FieldGroup } from "../../components/ui/field";

function RecuperacaoSenha() {
   const form = useForm();
   const {
      handleSubmit,
      formState: { errors },
   } = form;
   const location = useLocation();
   const [token, setToken] = useState("");
   const [student, setStudent] = useState(false);
   const [senhaAlterada, setSenhaAlterada] = useState(false);

   useEffect(() => {
      (async function load() {
         const token = new URLSearchParams(location.search).get("token");
         const student = new URLSearchParams(location.search).get("student");
         if (student) setStudent(true);
         setToken(token);
      })();
   }, []);

   async function submit(data) {
      if (data.nova_senha !== data.repete_nova_senha) {
         toast.error("A senhas não são iguais!");
         return;
      }

      let resp;
      if (student) {
         resp = await updatePasswordStudent(token, data.nova_senha);
      } else {
         resp = await updatePassword(token, data.nova_senha);
      }
      if (resp) setSenhaAlterada(true);
   }

   return (
      <div className="grid min-h-svh lg:grid-cols-2">
         <div className="flex flex-col gap-4 p-6 md:p-10">
            <div className="flex justify-center gap-2 md:justify-start">
               <a href="#" className="flex items-center gap-2 font-medium">
                  <div className="bg-secondary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                     <GalleryVerticalEnd className="size-4" />
                     <img src="../assets/images/logos/logo.png" />
                  </div>
                  FitCpx
               </a>
            </div>
            <div className="flex flex-1 items-center justify-center">
               <div className="w-full max-w-xs">
                  <FormProvider {...form}>
                     <form onSubmit={handleSubmit(submit)}>
                        {!senhaAlterada && (
                           <FieldGroup>
                              <div className="flex flex-col items-center gap-1 text-center">
                                 <h1 className="text-2xl font-bold">Recuperar conta</h1>
                                 <p className="text-muted-foreground text-sm text-balance">
                                    Enviaremos um link de recuperação para o e-mail informado caso exista conta.
                                 </p>
                              </div>

                              <FitFormUI
                                 errors={errors}
                                 fields={[
                                    {
                                       cols: 1,
                                       fields: [
                                          {
                                             label: "Nova Senha",
                                             fieldName: "nova_senha",
                                             inputType: "password",
                                             options: {
                                                required: true,
                                                minLength: 5,
                                             },
                                          },
                                          {
                                             label: "Repetir Nova Senha",
                                             fieldName: "repete_nova_senha",
                                             inputType: "password",
                                             options: {
                                                required: true,
                                                minLength: 5,
                                             },
                                          },
                                       ],
                                    },
                                 ]}
                              />

                              <Field>
                                 <Button type="submit">Confirmar senha</Button>
                              </Field>
                           </FieldGroup>
                        )}

                        {senhaAlterada && (
                           <FieldGroup>
                              <div className="flex flex-col items-center gap-1 text-center">
                                 <h1 className="text-2xl font-bold">Senha alterada!</h1>
                                 <p className="text-muted-foreground text-sm text-balance">
                                    Agora você já pode acessar sua conta com a nova senha.
                                 </p>
                              </div>
                              {!student && (
                                 <Field className="text-center">
                                    <a href="/entrar">
                                       <Button type="button">Ir para o login</Button>
                                    </a>
                                 </Field>
                              )}
                           </FieldGroup>
                        )}
                     </form>
                  </FormProvider>
               </div>
            </div>
         </div>

         <div className="bg-muted relative hidden lg:block">
            <img
               src="/assets/images/app/app-pt.png"
               // src="../assets/images/logos/logo.png"
               alt="Image"
               // className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
               className="absolute inset-0 h-full w-full object-cover"
            />
         </div>
      </div>
   );
}

export default RecuperacaoSenha;
