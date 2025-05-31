import { useEffect, useState } from "react";
import { calcularMedianaOuRepetido } from "../utils";

function MediaInput({ campo, register, setValue, startSpeechRecognition, metodo, required, defaultValue, id }) {
    const [valor1, setValor1] = useState("");
    const [valor2, setValor2] = useState("");
    const [valor3, setValor3] = useState("");
    const [medirNovamente, setMedirNovamente] = useState(false);
    const [media, setMedia] = useState('');
    
    useEffect(() => {
        setMedia(defaultValue);
    }, [defaultValue]);

    // Calcula a média quando os valores 1 ou 2 mudam
    useEffect(() => {
        //Se metodo for media e existir os 2 valor vai calcular
        if (metodo === "media" && valor1 && valor2) {
            setMedia(((parseFloat(valor1) + parseFloat(valor2)) / 2).toFixed(1));
            setValue(campo, ((parseFloat(valor1) + parseFloat(valor2)) / 2).toFixed(1));
            const diff = Math.abs(parseFloat(valor1) - parseFloat(valor2));

            if (diff > 1 && valor3) {
                const att = calcularMedianaOuRepetido(valor1, valor2, valor3);
                setMedia(att);
                setValue(campo, att);
            }
            setMedirNovamente(diff > 1);
        } else setMedirNovamente(false);
    }, [valor1, valor2, valor3, metodo]);
    
    
    function changeValue(e) {
        setMedia(e.target.value);
    }
    
    return (
        <div className="input-group">
            <div className="input-group">
                {/* Exibe dois campos de entrada se o método for 'media', ou um único campo caso contrário */}
                {metodo === "media" && (
                    <>
                        <input type="number" step="0.01" className="form-control" value={valor1} onChange={(e) => setValor1(e.target.value)} />
                        <input type="number" step="0.01" className="form-control" value={valor2} onChange={(e) => setValor2(e.target.value)} />
                        {medirNovamente && (
                            <input type="number" step="0.01" className="form-control" value={valor3} onChange={(e) => setValor3(e.target.value)} />
                        )}
                        {/* <input type="text" className="form-control bg-success" value={media} readOnly placeholder="Média" /> */}
                    </>
                )}

                <input
                    id={id}
                    value={media}
                    onChange={changeValue}
                    readOnly={metodo === "media"}
                    {...register(campo, { required: required ? 'Dobras obrigatórias!' : false })}
                    type="number"
                    step="0.1"
                    className="form-control"
                    // onKeyDown={e => e.preventDefault()}
                />

                {metodo === "normal" && (
                    <button type="button" className="btn btn-outline-success" onClick={() => startSpeechRecognition(campo)}>
                        <i className="bi bi-mic"></i>
                    </button>
                )}
            </div>

            {medirNovamente && (
                <div id="mediahelp" className="form-text">3º medida necessária</div>
            )}
        </div>
    );
}

export default MediaInput;