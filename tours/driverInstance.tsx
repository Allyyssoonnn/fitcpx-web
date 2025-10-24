import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { configSteps } from "./steps/config.tour";

const driverInstance = driver({
   allowClose: false,
   nextBtnText: "Próximo",
   prevBtnText: "Voltar",
   doneBtnText: "Feito",
   onPopoverRender: (popover, { state }) => {
      // Garante que o footer exista antes de mexer
      const appendButtons = () => {
         if (!popover.footerButtons) {
            requestAnimationFrame(appendButtons); // espera o próximo frame
            return;
         }

         popover.footerButtons.innerHTML = "";

         const currentIndex = state.activeIndex;
         const currentStep = state.activeStep;
         const previousStep = state.previousStep;
         const isLastStep = currentIndex === configSteps.length - 1;

         const isStepInput = (step) => step?.isInput === true;

         // BOTÃO PULAR
         const skipBtn = document.createElement("button");
         skipBtn.innerText = "Pular Tour";
         skipBtn.classList.add("driver-button");
         // skipBtn.addEventListener("click", () => driverInstance.destroy());
         skipBtn.addEventListener("click", () => {
            driverInstance.destroy();
            detachGlobalListener();
         });
         popover.footerButtons.appendChild(skipBtn);

         // BOTÃO VOLTAR
         if (isStepInput(previousStep)) {
            const prevBtn = document.createElement("button");
            prevBtn.innerText = "Voltar";
            prevBtn.classList.add("driver-button", "driver-prev-btn");
            // prevBtn.addEventListener("click", () => driverInstance.movePrevious());
            prevBtn.addEventListener("click", () => {
               // 🚨 CORREÇÃO DE RECUO: Sincroniza o índice *antes* do movePrevious
               currentStepIndex = Math.max(currentStepIndex - 1, 0);
               localStorage.setItem("currentTourStep", String(currentStepIndex)); // Opcional, mas recomendado

               driverInstance.movePrevious();
            });
            popover.footerButtons.appendChild(prevBtn);
         }

         // BOTÃO NEXT / DONE
         if (isStepInput(currentStep)) {
            const btn = document.createElement("button");
            btn.innerText = isLastStep ? "Feito" : "Próximo";
            btn.classList.add("driver-button");
            // btn.addEventListener("click", () => (isLastStep ? driverInstance.destroy() : driverInstance.moveNext()));
            btn.addEventListener("click", () => {
               // 🚨 CORREÇÃO DE AVANÇO: Sincroniza o índice *antes* do moveNext/destroy
               currentStepIndex = Math.min(currentStepIndex + 1, configSteps.length - 1);
               localStorage.setItem("currentTourStep", String(currentStepIndex)); // Opcional, mas recomendado

               if (isLastStep) {
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
   onNextClick: () => (currentStepIndex = Math.min(currentStepIndex + 1, configSteps.length - 1)),
   onPrevClick: () => currentStepIndex - 1,
});

// Estado do tour
let currentStepIndex = 0;
currentStepIndex = parseInt(localStorage.getItem("currentTourStep") || "0", 10);
let tourRunning = false;

function onScrollRefresh() {
   if (tourRunning) {
      driverInstance.refresh();
   }
}

// Função para iniciar o tour
export function startTour() {
   driverInstance.setSteps(configSteps);
   driverInstance.drive();
   tourRunning = true;
   currentStepIndex = 0;
   window.addEventListener("scroll", onScrollRefresh, true);
   driverInstance.setConfig({
      ...driverInstance.getConfig(),
      onHighlighted: () => setTimeout(() => driverInstance.refresh(), 250),
      onDestroyStarted: () => {
         detachGlobalListener();
         window.removeEventListener("scroll", onScrollRefresh, true);
         tourRunning = false;
      },
   });
   attachGlobalListener();
}

// Função para obter o seletor atual
function getCurrentStepElement(): string | HTMLElement | undefined {
   const step = configSteps[currentStepIndex];
   return step?.element;
}

// Listener global de clique
function onGlobalClick(e: MouseEvent) {
   if (!tourRunning) return;

   const step = configSteps[currentStepIndex];
   if (!step) return;

   const stepElement = getCurrentStepElement();
   if (!stepElement) return;

   const target = e.target as HTMLElement;
   if (!target) return;

   let clicked = false;

   if (typeof stepElement === "string") {
      clicked = !!target.closest(stepElement);
   } else {
      clicked = stepElement.contains(target);
   }

   if (clicked) {
      // Salva o índice do passo atual no localStorage
      localStorage.setItem("currentTourStep", String(currentStepIndex));

      if (step.isInput === true) {
         return; // Não avança automaticamente
      }

      const isLastStep = currentStepIndex === configSteps.length - 1;

      if (isLastStep) {
         driverInstance.destroy();
         return;
      }

      const nextStep = configSteps[currentStepIndex + 1];
      const nextElement = nextStep?.element;

      if (typeof nextElement === "string") {
         waitForElement(nextElement).then(() => {
            if (typeof driverInstance.moveNext === "function") {
               driverInstance.moveNext?.();
               currentStepIndex = Math.min(currentStepIndex + 1, configSteps.length - 1);
            }
         });
      } else {
         driverInstance.moveNext?.();
         currentStepIndex = Math.min(currentStepIndex + 1, configSteps.length - 1);
      }
   }
}

// Inicializa o listener
export function attachGlobalListener() {
   document.addEventListener("click", onGlobalClick, true);
}

// Remove o listener se precisar
export function detachGlobalListener() {
   document.removeEventListener("click", onGlobalClick, true);
   window.removeEventListener("scroll", onScrollRefresh, true);
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
