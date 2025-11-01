import { GalleryVerticalEnd } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { recoveryAccount } from "../../api/user";
import FitFormUI from "../../components/fitUI/fitForm.ui";
import { Button } from "../../components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldSeparator } from "../../components/ui/field";

function Recovery() {
   const form = useForm();
   const {
      handleSubmit,
      register,
      formState: { errors },
   } = form;
   const navigate = useNavigate();

   async function recoveryPassword(data) {
      console.log(data);
      const resp = await recoveryAccount(data.email);

      if (resp) {
         navigate("/entrar");
         toast.success("E-mail enviado!");
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
                     <form onSubmit={handleSubmit(recoveryPassword)}>
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
                                          label: "E-mail",
                                          id: "email",
                                          fieldName: "email",
                                          inputType: "email",
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
                              <Button type="submit">Enviar Link</Button>
                           </Field>

                           <FieldSeparator>Ou continue com</FieldSeparator>

                           <Field>
                              <FieldDescription className="text-center">
                                 Lembrou a senha?{" "}
                                 <a href="/entrar" className="underline underline-offset-4 text-primary">
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

export default Recovery;
