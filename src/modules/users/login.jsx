import { GalleryVerticalEnd } from "lucide-react";
import { setCookie } from "nookies";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { getGoogleUrlLogin, loggedGoogle } from "../../api/google";
import { userLogin } from "../../api/user";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldSeparator } from "../../components/ui/field";
import { stateEmpresa, stateUsuario } from "../../states/states";

function Login() {
   const form = useForm();
   const {
      handleSubmit,
      register,
      formState: { errors },
   } = form;
   const [usuario, setusuario] = useRecoilState(stateUsuario);
   const [empresa, setempresa] = useRecoilState(stateEmpresa);

   useEffect(() => {
      (async function conect() {
         const params = new URLSearchParams(window.location.search);
         const code = params.get("code");
         const scope = params.get("scope");

         if (code) {
            const resp = await loggedGoogle(code, scope, usuario?.cod_empresa);

            if (resp.token) {
               toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
               setCookie(null, "token", resp.token, { maxAge: 60 * 60 * 7 });
               setCookie(null, "refreshToken", resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
               setCookie(null, "licenseStatus", resp.status, { maxAge: 60 * 60 * 24 * 7 });
               setusuario(resp.usuario);
               setempresa(resp.empresa);
               window.location.href = "/";
            } else {
               toast.error(resp?.msg);
            }
         }
      })();
   }, []);

   async function conect(e) {
      e.preventDefault();
      const url = await getGoogleUrlLogin();
      if (url) window.location.href = url;
   }

   async function onLogin(data) {
      const resp = await userLogin({ email: data.email, password: data.senha });
      if (resp.token) {
         toast.success(`Bem vindo ${resp.usuario.nome_usuario}!`);
         setCookie(null, "token", resp.token, { maxAge: 60 * 60 * 7 });
         setCookie(null, "refreshToken", resp.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
         setCookie(null, "licenseStatus", resp.license.status, { maxAge: 60 * 60 * 24 * 7 });
         setCookie(null, "licenseTrialDaysLeft", resp.license.trialDaysLeft, { maxAge: 60 * 60 * 24 * 7 });
         setusuario(resp.usuario);
         setempresa(resp.empresa);
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
                     <form onSubmit={handleSubmit(onLogin)}>
                        <FieldGroup>
                           <div className="flex flex-col items-center gap-1 text-center">
                              <h1 className="text-2xl font-bold">Acessar conta</h1>
                              <p className="text-muted-foreground text-sm text-balance">
                                 Informe suas credenciais para acessar sua conta.
                              </p>
                           </div>

                           <FitFormUI
                              errors={errors}
                              fields={[
                                 {
                                    cols: 1,
                                    fields: [
                                       {
                                          label: "E-mail",
                                          id: "email",
                                          fieldName: "email",
                                          inputType: "email",
                                          options: {
                                             required: true,
                                             minLength: 5,
                                          },
                                       },
                                       {
                                          label: "Senha",
                                          id: "password",
                                          fieldName: "senha",
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
                              <Button type="submit">Entrar</Button>
                           </Field>

                           <FieldSeparator>Ou continue com</FieldSeparator>

                           <Field>
                              {/* <Button variant="outline" type="button">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path
                                       d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                       fill="currentColor"
                                    />
                                 </svg>
                                 Login with GitHub
                              </Button> */}

                              <FieldDescription className="text-center">
                                 <a href="/recuperar" className="ml-auto text-sm underline-offset-4 hover:underline">
                                    Esqueceu a senha?
                                 </a>
                              </FieldDescription>

                              <FieldDescription className="text-center">
                                 Ainda não tem conta?{" "}
                                 <a href="/registrar" className="underline underline-offset-4 text-primary">
                                    Criar conta
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
               src="https://fitcpx.com/assets/imagens/app-pt.png"
               // src="../assets/images/logos/logo.png"
               alt="Image"
               // className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
               className="absolute inset-0 h-full w-full object-cover"
            />
         </div>
      </div>
   );
}

export default Login;
