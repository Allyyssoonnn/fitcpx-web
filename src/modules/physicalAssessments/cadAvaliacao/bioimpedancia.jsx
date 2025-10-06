function Bioimpedancia({ tipoAvaliacao, ocultarCampos, register, startSpeechRecognition }) {
   return (
      <div className="row g-3">
         <div className="col-md-4">
            <label className="form-label">Gordura visceral</label>
            <div className="input-group">
               <input
                  id="gordura_viceral"
                  type="number"
                  step="0.01"
                  {...register("gordura_viceral")}
                  className="form-control"
               />
               <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => startSpeechRecognition("gordura_viceral")}
               >
                  <i className="bi bi-mic"></i>
               </button>
            </div>
         </div>

         <div className="col-md-4">
            <label className="form-label">% Gordura</label>
            <div className="input-group">
               <input
                  id="bioimpedancia_gordura"
                  type="number"
                  step="0.01"
                  {...register("bioimpedancia_gordura")}
                  className="form-control"
               />
               <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => startSpeechRecognition("bioimpedancia_gordura")}
               >
                  <i className="bi bi-mic"></i>
               </button>
            </div>
         </div>

         <div className="col-md-4">
            <label className="form-label">% Muscular</label>
            <div className="input-group">
               <input
                  id="bioimpedancia_muscular"
                  type="number"
                  step="0.01"
                  {...register("bioimpedancia_muscular")}
                  className="form-control"
               />
               <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => startSpeechRecognition("bioimpedancia_muscular")}
               >
                  <i className="bi bi-mic"></i>
               </button>
            </div>
         </div>

         <div className="col-md-4">
            <label className="form-label">Idade Corporal</label>
            <div className="input-group">
               <input
                  id="bioimpedancia_idade"
                  type="number"
                  step="0.01"
                  {...register("bioimpedancia_idade")}
                  className="form-control"
               />
               <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={() => startSpeechRecognition("bioimpedancia_idade")}
               >
                  <i className="bi bi-mic"></i>
               </button>
            </div>
         </div>
      </div>
   );
}

export default Bioimpedancia;
