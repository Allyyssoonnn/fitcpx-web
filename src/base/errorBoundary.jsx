import { MessageCircle, MoveLeft } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendErrorUser } from "../api/user";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";

function ErrorBoundaryWrapper({ children }) {
   const [hasError, setHasError] = useState(false);
   const [error, setError] = useState(null);

   return hasError ? (
      <ErrorScreen />
   ) : (
      <ErrorBoundary setHasError={setHasError} setError={setError}>
         {children}
      </ErrorBoundary>
   );
}

// Tela de erro estilizada com Bootstrap
const ErrorScreen = () => {
   const navigate = useNavigate();

   function reload() {
      navigate("/entrar");
      window.location.reload();
   }

   return (
      <div className="d-flex flex-column justify-content-center align-items-center bg-accent vh-100 text-light">
         <Card style={{ maxWidth: "500px", width: "100%" }}>
            <CardContent className="text-center">
               <h1 className="text-danger mb-4">
                  <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "3rem" }}></i>
               </h1>
               <h2 className="mb-3">Ops! Algo deu errado...</h2>
               <p className="lead text-muted">
                  Encontramos um problema inesperado. Estamos trabalhando para corrigir isso.
               </p>
            </CardContent>

            <CardFooter className="justify-between">
               <Button onClick={reload}>
                  <MoveLeft />
                  Voltar ao app
               </Button>

               <Button
                  onClick={() =>
                     window.open(
                        `https://wa.me/55449991654044?text=${encodeURIComponent(
                           "Olá, estou com problemas no FitCpx.\n Pode me ajudar?"
                        )}`,
                        "_blank"
                     )
                  }
               >
                  <MessageCircle />
                  Suporte
               </Button>
            </CardFooter>
         </Card>
      </div>
   );
};

// Error Boundary baseado em classe dentro do funcional
class ErrorBoundary extends React.Component {
   componentDidCatch(error, errorInfo) {
      console.error("ErrorBoundary capturou um erro:", error, errorInfo);

      // Atualiza o estado do componente pai
      this.props.setHasError(true);
      this.props.setError(error);

      // Enviar erro para um servidor
      sendErrorUser(error.toString(), JSON.stringify(errorInfo));
   }

   render() {
      return this.props.children;
   }
}

export default ErrorBoundaryWrapper;
