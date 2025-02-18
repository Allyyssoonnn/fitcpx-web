import { Suspense } from "react";

import routes from '../routes/routes';
import { Navigate, Route, Routes } from "react-router-dom";

function Conteudo() {
    return (
        <Suspense fallback={
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        }>
            <Routes>
                {routes.map((route, idx) => {
                    return (
                        route.element && (
                            <Route
                                key={idx}
                                path={route.path}
                                exact={route.exact}
                                name={route.name}
                                element={<route.element />}
                            />
                        )
                    )
                })}
                <Route path="/" element={<Navigate to="dashboard" replace />} />
            </Routes>
        </Suspense>
    );
}

export default Conteudo;