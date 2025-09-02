import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { PRODUCAO } from "../api/api";
import { sendFeedback } from "../api/app";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { stateApp, stateEmpresa, useNotificacao, useToggleSidebar } from "../states/states";

function Sidebar() {
   const [empresa] = useRecoilState(stateEmpresa);
   const { nSuccess } = useNotificacao();
   const { handleSubmit, register, reset, watch, setValue } = useForm();
   const { t } = useTranslation("sidebar");
   const navigate = useNavigate();
   const { openSidebar, closeSidebar } = useToggleSidebar();
   const [{ openedSidebar }] = useRecoilState(stateApp);

   const [dropTreino, setDropTreino] = useState(false);
   const [dropAdmin, setDropAdmin] = useState(false);
   const [dropFinanceiro, setdropFinanceiro] = useState(false);

   const feedbackType = watch("feedbackType");

   useEffect(() => {
      //Verifica se a tela é grande e aciona a SideBar caso o state esteja false
      // if (window.screen.width > 1600 && !openedSidebar) toggleSidebar();
   }, []);

   function go(route) {
      // toggleSidebar();
      setDropTreino(false);
      setDropAdmin(false);
      navigate(route);
   }

   async function handleFeedbackSubmit(data) {
      sendFeedback(empresa.cod_empresa, data.feedbackType, data.feedbackMessage);
      console.log("Feedback submitted");
      reset();
      nSuccess("Feedback enviado com sucesso!", "Obrigado por nos ajudar a melhorar a sua experiencia!");
   }

   return (
      <motion.aside
         className="left-sidebar with-vertical"
         style={{
            borderLeft: `0.30rem solid ${PRODUCAO ? "#85D446" : "#FF0000"}`,
            overflowY: "auto",
            overflowX: "hidden",
            // zIndex: '999',
            zIndex: 4,
            width: openedSidebar ? "" : "0px",
         }}
         initial={{ x: -300 }}
         animate={{ x: openedSidebar ? 0 : -300 }}
         transition={{ duration: 0.3, ease: "easeInOut" }}
      >
         <div className="h-100 d-flex flex-column">
            {/* Header */}
            <div className="brand-logo d-flex align-items-center justify-content-between border-bottom shadow-sm bg-gradient-primary">
               <div className="d-flex align-items-center w-100 justify-content-center me-3">
                  <div className="position-relative">
                     <img src="../assets/images/logos/logo.png" alt="Logo" width="45" className="rounded-circle" />
                  </div>
                  <Typewriter texts={[t("welcome"), "Fit Complex", "Fit Cpx"]} />
               </div>

               <button
                  onClick={openedSidebar ? closeSidebar : openSidebar}
                  className="btn btn-outline btn-sm rounded-circle d-xl-none d-block sidebartoggler"
                  id="sidebarCollapse"
                  style={{ width: "32px", height: "32px", padding: "0" }}
               >
                  <i className="bi bi-x"></i>
               </button>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav scroll-sidebar flex-grow-1" data-simplebar="">
               <ul id="sidebarnav" className="p-0">
                  <li className="nav-small-cap">
                     <i className="bi bi-list nav-small-cap-icon fs-6"></i>
                     <span className="hide-menu ps-1 fw-bold text-muted">Menu</span>
                  </li>

                  <li className="sidebar-item">
                     <motion.a
                        href="#"
                        className="sidebar-link p-3 d-flex align-items-center rounded-3 mx-2 mb-1"
                        onClick={() => go("/")}
                        aria-expanded="false"
                        whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-graph-up fs-6 me-3 text-primary"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("dashboard")}</span>
                     </motion.a>
                  </li>

                  <li className="sidebar-item">
                     <motion.a
                        id="clients"
                        href="#"
                        className="sidebar-link p-3 d-flex align-items-center rounded-3 mx-2 mb-1"
                        onClick={() => go("/alunos")}
                        aria-expanded="false"
                        whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-person-rolodex fs-6 me-3 text-success"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("students")}</span>
                     </motion.a>
                  </li>

                  <li className="sidebar-item">
                     <motion.a
                        href="#"
                        className="sidebar-link p-3 d-flex align-items-center rounded-3 mx-2 mb-1"
                        onClick={() => go("/agenda")}
                        aria-expanded="false"
                        whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-calendar-check fs-6 me-3 text-warning"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("calendar")}</span>
                     </motion.a>
                  </li>

                  <li className="sidebar-item">
                     <motion.a
                        href="#"
                        className="sidebar-link p-3 d-flex align-items-center rounded-3 mx-2 mb-1"
                        onClick={() => go("/planilha")}
                        aria-expanded="false"
                        whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-journal-bookmark-fill fs-6 me-3 text-info"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("coach")}</span>
                     </motion.a>
                  </li>

                  <li className="sidebar-item">
                     <motion.a
                        href="#"
                        className="sidebar-link p-3 d-flex align-items-center rounded-3 mx-2 mb-1"
                        onClick={() => go("/avaliacoes")}
                        aria-expanded="false"
                        whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-activity fs-6 me-3 text-danger"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("assessment")}</span>
                     </motion.a>
                  </li>

                  {/* Workout Section */}
                  <li className="sidebar-item">
                     <motion.a
                        className={`sidebar-link p-3 has-arrow d-flex align-items-center rounded-3 mx-2 mb-1 ${
                           dropTreino ? "active bg-primary text-white" : ""
                        }`}
                        href="#"
                        onClick={() => setDropTreino(!dropTreino)}
                        whileHover={{
                           backgroundColor: dropTreino ? "rgba(13, 110, 253, 0.9)" : "rgba(13, 110, 253, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-card-checklist fs-6 me-3"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("workout")}</span>
                        <i
                           className={`bi bi-chevron-down ms-auto transition-all ${dropTreino ? "rotate-180" : ""}`}
                        ></i>
                     </motion.a>

                     <motion.ul
                        className={`collapse first-level ${dropTreino ? "in" : ""}`}
                        initial={false}
                        animate={{ height: dropTreino ? "auto" : 0, opacity: dropTreino ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                     >
                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/grupoexercicios")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-collection fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("muscles")}</span>
                           </motion.a>
                        </li>
                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/exercicios")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-activity fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("exercises")}</span>
                           </motion.a>
                        </li>
                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/treinos")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-card-checklist fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("workout")}</span>
                           </motion.a>
                        </li>
                     </motion.ul>
                  </li>

                  {/* Finance Section */}
                  <li className="sidebar-item">
                     <motion.a
                        id="finance"
                        className={`sidebar-link p-3 has-arrow d-flex align-items-center rounded-3 mx-2 mb-1 ${
                           dropFinanceiro ? "active bg-success text-white" : ""
                        }`}
                        href="#"
                        onClick={() => setdropFinanceiro(!dropFinanceiro)}
                        whileHover={{
                           backgroundColor: dropFinanceiro ? "rgba(25, 135, 84, 0.9)" : "rgba(25, 135, 84, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-bank fs-6 me-3"></i>
                        <span className="hide-menu ps-1 fw-semibold">{t("finance")}</span>
                        <i
                           className={`bi bi-chevron-down ms-auto transition-all ${dropFinanceiro ? "rotate-180" : ""}`}
                        ></i>
                     </motion.a>

                     <motion.ul
                        className={`collapse first-level ${dropFinanceiro ? "in" : ""}`}
                        initial={false}
                        animate={{ height: dropFinanceiro ? "auto" : 0, opacity: dropFinanceiro ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                     >
                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/financeOverview")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(25, 135, 84, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-clipboard-data fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("financeOverview")}</span>
                           </motion.a>
                        </li>

                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/contratos")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(25, 135, 84, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-archive fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("contracts")}</span>
                           </motion.a>
                        </li>

                        <li className="sidebar-item ms-4">
                           <motion.a
                              id="services"
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/modalidades")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(25, 135, 84, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-easel fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("services")}</span>
                           </motion.a>
                        </li>

                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/modcontratos")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(25, 135, 84, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-paperclip fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("contractTemplates")}</span>
                           </motion.a>
                        </li>

                        <li className="sidebar-item ms-4">
                           <motion.a
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/planos")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(25, 135, 84, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-basket fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("plans")}</span>
                           </motion.a>
                        </li>
                     </motion.ul>
                  </li>

                  {/* Admin Section */}
                  <li className="sidebar-item">
                     <motion.a
                        id="admin"
                        className={`sidebar-link p-3 has-arrow d-flex align-items-center rounded-3 mx-2 mb-1 ${
                           dropAdmin ? "active bg-warning text-dark" : ""
                        }`}
                        href="#"
                        onClick={() => setDropAdmin(!dropAdmin)}
                        whileHover={{
                           backgroundColor: dropAdmin ? "rgba(255, 193, 7, 0.9)" : "rgba(255, 193, 7, 0.1)",
                        }}
                        whileTap={{ scale: 0.98 }}
                     >
                        <i className="bi bi-person-vcard fs-6 me-3"></i>
                        <span className="hide-menu ps-1 fw-semibold">ADMIN</span>
                        <i className={`bi bi-chevron-down ms-auto transition-all ${dropAdmin ? "rotate-180" : ""}`}></i>
                     </motion.a>

                     <motion.ul
                        className={`collapse first-level ${dropAdmin ? "in" : ""}`}
                        initial={false}
                        animate={{ height: dropAdmin ? "auto" : 0, opacity: dropAdmin ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                     >
                        <li className="sidebar-item ms-4">
                           <motion.a
                              id="users"
                              href="#"
                              className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1"
                              onClick={() => go("/users")}
                              aria-expanded="false"
                              whileHover={{ backgroundColor: "rgba(255, 193, 7, 0.1)" }}
                              whileTap={{ scale: 0.98 }}
                           >
                              <i className="bi bi-person-lines-fill fs-6 me-3"></i>
                              <span className="hide-menu ps-1">{t("users")}</span>
                           </motion.a>
                        </li>

                        {/* <li className="sidebar-item ms-4">
                                    <motion.a 
                                        href="#" 
                                        className="sidebar-link p-2 d-flex align-items-center rounded-3 mx-2 mb-1" 
                                        onClick={() => go('/relatorios')} 
                                        aria-expanded="false"
                                        whileHover={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <i className="bi bi-bar-chart fs-6 me-3"></i>
                                        <span className="hide-menu ps-1">{t('reports')}</span>
                                    </motion.a>
                                </li> */}
                     </motion.ul>
                  </li>
               </ul>
            </nav>

            {/* Footer */}
            <div className="p-3 border-top">
               <div className="d-flex align-items-center justify-content-center">
                  <div className="d-flex items-center justify-around w-100">
                     <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => window.open("https://wa.me/55449991654044", "_blank")}
                     >
                        Suporte
                        <i className="bi bi-chat-right-text ms-2"></i>
                     </button>
                     <Dialog>
                        <DialogTrigger>
                           <button className="btn btn-sm btn-outline-info">
                              Enviar feedback
                              <i className="bi bi-chat-right-text ms-2"></i>
                           </button>
                        </DialogTrigger>

                        <DialogContent>
                           <DialogTitle className="text-black fs-6">Enviar feedback</DialogTitle>

                           <form onSubmit={handleSubmit(handleFeedbackSubmit)}>
                              <div>
                                 <Select
                                    value={feedbackType}
                                    onValueChange={(value) => setValue("feedbackType", value)}
                                 >
                                    <SelectTrigger className="w-full">
                                       <SelectValue placeholder="Selecione uma opção" />
                                    </SelectTrigger>

                                    <SelectContent>
                                       <SelectItem value="Reportar problema">Reportar problema</SelectItem>
                                       <SelectItem value="Sugestão de melhoria">Sugestão de melhoria</SelectItem>
                                       <SelectItem value="Alteração de exercício base">
                                          Alteração de exercício base
                                       </SelectItem>
                                       <SelectItem value="Outros">Outros</SelectItem>
                                    </SelectContent>
                                 </Select>

                                 <textarea
                                    className="form-control mt-3"
                                    rows="3"
                                    placeholder="Escreva aqui..."
                                    {...register("feedbackMessage")}
                                 />
                              </div>

                              <DialogFooter className="d-flex justify-content-end align-items-center mt-3">
                                 <DialogClose className="d-flex justify-content-end gap-3">
                                    <button type="button" className="btn btn-danger rounded">
                                       Fechar
                                    </button>
                                    <button type="submit" className="btn btn-success rounded">
                                       Enviar
                                    </button>
                                 </DialogClose>
                              </DialogFooter>
                           </form>
                        </DialogContent>
                     </Dialog>
                  </div>
               </div>
            </div>
         </div>
      </motion.aside>
   );
}

const Typewriter = ({ texts, speed = 100, delay = 2000, maxCycles = 2 }) => {
   const [displayText, setDisplayText] = useState("");
   const [textIndex, setTextIndex] = useState(0);
   const [charIndex, setCharIndex] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);
   const [cycleCount, setCycleCount] = useState(0);
   const [isFinished, setIsFinished] = useState(false);

   useEffect(() => {
      if (isFinished) {
         setDisplayText(texts[texts.length - 1]);
         return;
      }

      const currentText = texts[textIndex];

      if (!isDeleting) {
         if (charIndex < currentText.length) {
            setTimeout(() => {
               setDisplayText(currentText.slice(0, charIndex + 1));
               setCharIndex((prev) => prev + 1);
            }, speed);
         } else {
            setTimeout(() => setIsDeleting(true), delay);
         }
      } else {
         if (charIndex > 0) {
            setTimeout(() => {
               setDisplayText(currentText.slice(0, charIndex - 1));
               setCharIndex((prev) => prev - 1);
            }, speed / 2);
         } else {
            if (cycleCount + 1 >= maxCycles) {
               setIsFinished(true);
            } else {
               setIsDeleting(false);
               setTextIndex((prev) => (prev + 1) % texts.length);
               setCycleCount((prev) => prev + 1);
            }
         }
      }
   }, [charIndex, isDeleting, textIndex, texts, speed, delay, cycleCount, maxCycles, isFinished]);

   return (
      <motion.h3
         className="ms-3 mb-0 fs-6"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.5 }}
      >
         {displayText}
      </motion.h3>
   );
};

// PropTypes validation
Typewriter.propTypes = {
   texts: PropTypes.arrayOf(PropTypes.string).isRequired,
   speed: PropTypes.number,
   delay: PropTypes.number,
   maxCycles: PropTypes.number,
};

export default Sidebar;
