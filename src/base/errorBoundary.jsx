import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { sendError } from "../api/error";

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
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-light">
         <div className="card shadow-lg p-5" style={{ maxWidth: "500px", width: "100%" }}>
            <div className="text-center">
               <h1 className="text-danger mb-4">
                  <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "3rem" }}></i>
               </h1>
               <h2 className="mb-3">Ops! Algo deu errado...</h2>
               <p className="lead text-muted">
                  Encontramos um problema inesperado. Estamos trabalhando para corrigir isso.
               </p>
            </div>

            <div className="text-center mt-4">
               <button className="btn btn-primary btn-lg px-5 py-3" onClick={reload} style={{ fontSize: "1.1rem" }}>
                  <i className="bi bi-arrow-right-circle me-2" />
                  Voltar ao app
               </button>
            </div>
         </div>
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
      // sendError(error.toString(), errorInfo.componentStack);
   }

   render() {
      return this.props.children;
   }
}

export default ErrorBoundaryWrapper;
