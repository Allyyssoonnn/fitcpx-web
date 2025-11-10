import { GalleryVerticalEnd } from "lucide-react";
import { setCookie } from "nookies";
import { FormProvider, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toast } from "sonner";
import { userRegister } from "../../api/user";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldSeparator } from "../../components/ui/field";
import { stateEmpresa, stateUsuario } from "../../states/states";

function Register() {
   const form = useForm();
   const {
      handleSubmit,
      setError,
      clearErrors,
      formState: { errors },
   } = form;
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const [empresa, setempresa] = useRecoilState(stateEmpresa);

   async function registrar(data) {
      if (data.password !== data.confirmPassword) {
         setError("confirmPassword", { type: "manual", message: "As senhas não coincidem." });
         return;
      } else {
         clearErrors("confirmPassword");
      }

      const resp = await userRegister(data);

      if (resp.token) {
         toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
         setusuario(resp?.usuario);
         setempresa(resp?.empresa);
         setCookie(null, "token", resp.token, { maxAge: 30000 });
         setCookie(null, "refreshToken", resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
         setCookie(null, "licenseStatus", resp.status, { maxAge: 60 * 60 * 24 * 7 });
         window.location.href = "/";
      } else {
         toast.error(resp?.msg);
      }
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
                     <form onSubmit={handleSubmit(registrar)}>
                        <FieldGroup>
                           <div className="flex flex-col items-center gap-1 text-center">
                              <h1 className="text-2xl font-bold">Criar sua conta</h1>
                              <p className="text-muted-foreground text-sm text-balance">
                                 Preencha o formulário para criar sua conta.
                              </p>
                           </div>

                           <FitFormUI
                              errors={errors}
                              fields={[
                                 {
                                    cols: 1,
                                    fields: [
                                       {
                                          label: "Nome",
                                          id: "name",
                                          fieldName: "name",
                                          options: {
                                             required: true,
                                             minLength: 5,
                                          },
                                       },
                                       {
                                          label: "E-mail",
                                          id: "email",
                                          fieldName: "email",
                                          options: {
                                             required: true,
                                             minLength: 5,
                                          },
                                       },
                                       {
                                          label: "Telefone",
                                          id: "phone",
                                          fieldName: "phone",
                                          type: "phone",
                                          options: {
                                             required: true,
                                             minLength: 5,
                                          },
                                       },
                                       {
                                          label: "Senha",
                                          id: "password",
                                          fieldName: "password",
                                          inputType: "password",
                                          options: {
                                             required: true,
                                             minLength: 5,
                                          },
                                       },
                                       {
                                          label: "Confirmar Senha",
                                          id: "confirm-password",
                                          fieldName: "confirmPassword",
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
                              <Button id="register" type="submit">
                                 Registrar
                              </Button>
                           </Field>

                           <FieldSeparator>Ou continue com</FieldSeparator>

                           <Field>
                              <FieldDescription className="text-center">
                                 Já tem conta?{" "}
                                 <a href="/entrar" className="text-primary">
                                    Entrar
                                 </a>
                              </FieldDescription>
                           </Field>
                        </FieldGroup>
                     </form>
                  </FormProvider>
               </div>
            </div>
         </div>

         <div className="bg-muted relative hidden lg:block">
            <img
               // src="https://ui.shadcn.com/placeholder.svg"
               src="/assets/images/app/app-pt.png"
               alt="Image"
               // className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
               className="absolute inset-0 h-full w-full object-cover"
            />
         </div>
      </div>
   );
}

export default Register;
