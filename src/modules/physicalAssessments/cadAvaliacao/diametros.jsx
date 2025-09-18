function Diametros({ tipoAvaliacao, ocultarCampos, register, startSpeechRecognition, bringLast, showBringLast }) {
   return (
      <div className="row g-3">
         {["biestiloide_punho", "biepicondilo_umeral", "biepicondilo_femoral"].map((campo, index) => {
            const obigratorio = (index === 0 || index === 2) && tipoAvaliacao === "completo";
            return (
               <div key={index} className={`col-md-4 ${!obigratorio && ocultarCampos ? "d-none" : ""}`}>
                  <label className={`form-label ${obigratorio ? "fw-bold" : ""}`}>
                     {campo.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())} {obigratorio ? "*" : ""} (cm)
                  </label>
                  <div className="input-group">
                     <input
                        id={campo}
                        type="number"
                        step="0.01"
                        {...register(campo, { required: obigratorio ? "Diamêtro obrigatório!" : false })}
                        className="form-control"
                     />
                     {showBringLast && (
                        <button className="btn btn-outline-dark" onClick={(e) => bringLast(e, campo)}>
                           <i className="bi bi-arrow-counterclockwise" />
                        </button>
                     )}
                     <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={() => startSpeechRecognition(campo)}
                     >
                        <i className="bi bi-mic"></i>
                     </button>
                  </div>
               </div>
            );
         })}
      </div>
   );
}

export default Diametros;
