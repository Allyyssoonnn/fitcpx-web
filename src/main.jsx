import "bootstrap-icons/font/bootstrap-icons.css";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import App from "./App.jsx";
import "./index.css";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { ExcelExportModule } from "ag-grid-enterprise";
ModuleRegistry.registerModules([AllCommunityModule]);
ModuleRegistry.registerModules([ExcelExportModule]);

import "./i18n";
import "./scss/CardInput.scss";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
   <RecoilRoot>
      <QueryClientProvider client={queryClient}>
         <App />
      </QueryClientProvider>
   </RecoilRoot>
);
