import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([ExcelExportModule]);

import "./scss/CardInput.scss";
import "./i18n";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </RecoilRoot>
  // </StrictMode>,
);
