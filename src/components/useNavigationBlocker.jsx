import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useNavigationBlocker(isDirty) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
            event.preventDefault();
            event.returnValue = "Tem certeza que deseja sair sem salvar?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        if (isDirty) {
            window.history.pushState(null, "", window.location.pathname);
        }

        const handlePopState = () => {
            if (isDirty && !window.confirm("Tem certeza que deseja sair sem salvar?")) {
                window.history.pushState(null, "", window.location.pathname);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [isDirty, location]);

    return (path, options = {}) => {
        if (!isDirty || window.confirm("Tem certeza que deseja sair sem salvar?")) {
            navigate(path, options);
        }
    };
}