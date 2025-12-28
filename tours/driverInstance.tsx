import { sleep } from "@/utils/utils";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { configSteps } from "./steps/config.tour";

// Estado do tour
let currentStepIndex = parseInt(localStorage.getItem("currentTourStepUpdate") || "0", 10);
let tourRunning = false;
let currentSteps = configSteps;

// Variável de controle do observer (fora da função para persistir entre chamadas)
let portalObserver: MutationObserver | null = null;

function clearTourState() {
   localStorage.removeItem("currentTourStepUpdate");
   localStorage.removeItem("currentTourNameUpdate");
   currentStepIndex = 0;
}

const driverInstance = driver({
   allowClose: false,
   nextBtnText: "Próximo",
   prevBtnText: "Voltar",
   doneBtnText: "Feito",

   onDestroyed: () => {
      localStorage.removeItem("currentTourStepUpdate");
      localStorage.removeItem("currentTourNameUpdate");
      tourRunning = false;
   },

   onPopoverRender: (popover, { state }) => {
      const appendButtons = () => {
         if (!popover.footerButtons) {
            requestAnimationFrame(appendButtons);
            return;
         }

         popover.footerButtons.innerHTML = "";

         const currentIndex = state.activeIndex;
         const currentStep = state.activeStep;
         const previousStep = state.previousStep;
         const isLastStep = currentIndex === currentSteps.length - 1;
         const isStepInput = (step: any) => step?.isInput === true;

         // BOTÃO PULAR
         const skipBtn = document.createElement("button");
         skipBtn.innerText = "Pular Tour";
         skipBtn.classList.add("driver-button");
         skipBtn.addEventListener("click", () => {
            clearTourState();
            driverInstance.destroy();
            detachGlobalListener();
         });
         popover.footerButtons.appendChild(skipBtn);

         // BOTÃO VOLTAR
         if (isStepInput(previousStep)) {
            const prevBtn = document.createElement("button");
            prevBtn.innerText = "Voltar";
            prevBtn.classList.add("driver-button", "driver-prev-btn");
            prevBtn.addEventListener("click", () => {
               currentStepIndex = Math.max(currentStepIndex - 1, 0);
               localStorage.setItem("currentTourStepUpdate", String(currentStepIndex));
               driverInstance.movePrevious();
            });
            popover.footerButtons.appendChild(prevBtn);
         }

         // BOTÃO NEXT / DONE
         if (isStepInput(currentStep)) {
            const btn = document.createElement("button");
            btn.innerText = isLastStep ? "Feito" : "Próximo";
            btn.classList.add("driver-button");
            btn.addEventListener("click", () => {
               currentStepIndex = Math.min(currentStepIndex + 1, currentSteps.length - 1);
               localStorage.setItem("currentTourStepUpdate", String(currentStepIndex));

               if (isLastStep) {
                  clearTourState();
                  driverInstance.destroy();
               } else {
                  driverInstance.moveNext();
               }
            });
            popover.footerButtons.appendChild(btn);
         }
      };
      appendButtons();
   },

   onNextClick: () => {
      currentStepIndex = Math.min(currentStepIndex + 1, currentSteps.length - 1);
      localStorage.setItem("currentTourStepUpdate", String(currentStepIndex));
   },

   onPrevClick: () => {
      currentStepIndex = Math.max(currentStepIndex - 1, 0);
      localStorage.setItem("currentTourStepUpdate", String(currentStepIndex));
   },
});

// 🔄 RESTORE AUTOMÁTICO
(async function restoreTour() {
   const savedTour = localStorage.getItem("currentTourNameUpdate");
   if (!savedTour) return;

   if (savedTour === "config") currentSteps = configSteps;
   if (savedTour === "workout") {
      const mod = await import("./steps/workout.tour");
      currentSteps = mod.workoutSteps;
   }

   currentStepIndex = parseInt(localStorage.getItem("currentTourStepUpdate") || "0", 10);

   configureDriver();
   driverInstance.setSteps(currentSteps);

   tourRunning = true;
   window.addEventListener("scroll", onScrollRefresh, true);
   attachGlobalListener();

   driverInstance.drive(currentStepIndex);
})();

function onScrollRefresh() {
   if (tourRunning) driverInstance.refresh();
}

// Helper para configurar o driver (evita repetição de código)
function configureDriver() {
   driverInstance.setConfig({
      ...driverInstance.getConfig(),
      onHighlighted: () => setTimeout(() => driverInstance.refresh(), 250),
      onDestroyStarted: () => {
         detachGlobalListener();
         window.removeEventListener("scroll", onScrollRefresh, true);
         tourRunning = false;
      },
   });
}

export async function startTour(tourName: string, verifySidebar?: (needOpen: boolean) => void) {
   localStorage.setItem("currentTourNameUpdate", tourName);

   if (tourName === "config") currentSteps = configSteps;
   if (tourName === "workout") {
      const mod = await import("./steps/workout.tour");
      currentSteps = mod.workoutSteps;
   }

   if (currentSteps[0].needOpenSidebar !== undefined && verifySidebar) {
      verifySidebar(currentSteps[0].needOpenSidebar);
      await sleep(500);
   }

   currentStepIndex = 0;
   localStorage.setItem("currentTourStepUpdate", "0");

   configureDriver();
   driverInstance.setSteps(currentSteps);

   tourRunning = true;
   window.addEventListener("scroll", onScrollRefresh, true);
   attachGlobalListener(verifySidebar);

   driverInstance.drive();
}

function getCurrentStepElement(): string | HTMLElement | undefined {
   return currentSteps[currentStepIndex]?.element;
}

// LISTENER GLOBAL DE CLIQUE
async function onGlobalClick(e: MouseEvent, verifySidebar?: (needOpen: boolean) => void) {
   if (!tourRunning) return;

   const step = currentSteps[currentStepIndex];
   if (!step) return;

   const stepElement = getCurrentStepElement();
   const stepDomElement = typeof stepElement === "string" ? document.querySelector(stepElement) : stepElement;

   if (!stepDomElement) return;

   const target = e.target as HTMLElement;
   if (!target) return;

   let clicked = false;

   if (typeof stepElement === "string") {
      clicked = !!target.closest(stepElement);
   } else {
      clicked = stepElement.contains(target);
   }

   // SÓ EXECUTA LÓGICA SE CLICOU NO ELEMENTO DO PASSO
   if (clicked) {
      localStorage.setItem("currentTourStepUpdate", String(currentStepIndex));

      // --- LÓGICA DO PORTAL (RADIX/SHADCN) ---
      if (step.isPortal) {
         console.log("Trigger clicado. Preparando observador de Portal...");

         // 1. Limpeza de segurança
         if (portalObserver) {
            portalObserver.disconnect();
            portalObserver = null;
         }

         // 2. Aguarda renderização do Portal
         setTimeout(() => {
            const portalElement = document.querySelector("[data-radix-popper-content-wrapper]") as HTMLElement;

            if (portalElement) {
               // A. Move Highlight para o Menu
               driverInstance.highlight({
                  ...step,
                  element: portalElement,
                  popover: {
                     ...step.popover,
                     description: "Selecione uma opção.",
                     side: "right",
                  },
               });

               // B. Inicia Espionagem (MutationObserver)
               portalObserver = new MutationObserver((mutations) => {
                  for (const mutation of mutations) {
                     for (const removedNode of Array.from(mutation.removedNodes)) {
                        // Detecta se o portal foi removido (seleção ou fechamento)
                        if (removedNode === portalElement || removedNode.contains(portalElement)) {
                           console.log("Portal fechou! (Seleção detectada)");

                           portalObserver?.disconnect();
                           portalObserver = null;

                           // Volta Highlight para o Trigger
                           driverInstance.highlight({
                              ...step,
                              element: stepDomElement as HTMLElement,
                              popover: {
                                 ...step.popover,
                                 description: "Opção selecionada!",
                              },
                           });

                           // Avança o Tour
                           setTimeout(() => {
                              // Checagem anti-race-condition
                              const currentIndexCheck = parseInt(
                                 localStorage.getItem("currentTourStepUpdate") || "0",
                                 10
                              );
                              if (currentIndexCheck !== currentStepIndex) return;

                              const isLastStep = currentStepIndex === currentSteps.length - 1;
                              currentStepIndex = Math.min(currentStepIndex + 1, currentSteps.length - 1);
                              localStorage.setItem("currentTourStepUpdate", String(currentStepIndex));

                              if (isLastStep) {
                                 clearTourState();
                                 driverInstance.destroy();
                              } else {
                                 driverInstance.drive(currentStepIndex);
                              }
                           }, 600);
                        }
                     }
                  }
               });

               // Observa o body
               portalObserver.observe(document.body, { childList: true });
            }
         }, 100);
      }
      // -----------------------------------------

      // Se for Input/Portal, o avanço é controlado acima ou manualmente.
      if (step.isInput === true) return;

      // Lógica padrão para passos normais (não inputs)
      const isLastStep = currentStepIndex === currentSteps.length - 1;

      if (isLastStep) {
         clearTourState();
         driverInstance.destroy();
         return;
      }

      const nextStep = currentSteps[currentStepIndex + 1];
      const nextElement = nextStep?.element;

      if (nextStep?.needOpenSidebar !== undefined && verifySidebar) {
         verifySidebar(nextStep.needOpenSidebar);
         await sleep(500);
      }

      if (typeof nextElement === "string") {
         waitForElement(nextElement).then(() => {
            driverInstance.moveNext?.();
            currentStepIndex = Math.min(currentStepIndex + 1, currentSteps.length - 1);
         });
      } else {
         driverInstance.moveNext?.();
         currentStepIndex = Math.min(currentStepIndex + 1, currentSteps.length - 1);
      }
   }
}

export function attachGlobalListener(verifySidebar?: (needOpen: boolean) => void) {
   document.addEventListener("click", (e) => onGlobalClick(e, verifySidebar), true);
}

export function detachGlobalListener() {
   document.removeEventListener("click", onGlobalClick, true);
   window.removeEventListener("scroll", onScrollRefresh, true);

   // 🧹 Limpeza do observer ao sair
   if (portalObserver) {
      portalObserver.disconnect();
      portalObserver = null;
   }
}

function waitForElement(selector: string, timeout = 3000): Promise<HTMLElement> {
   return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      const observer = new MutationObserver(() => {
         const elNow = document.querySelector(selector);
         if (elNow) {
            observer.disconnect();
            resolve(elNow);
         }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
         observer.disconnect();
         reject(new Error(`Elemento ${selector} não apareceu no DOM em ${timeout}ms`));
      }, timeout);
   });
}

export default driverInstance;
