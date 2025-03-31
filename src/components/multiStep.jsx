import { useState } from "react";
import { ProgressBar } from "react-bootstrap";

const MultiSteps = ({ children, indexStep, className }) => {
    return (
        (<div className={`container wizard-content ${className}`}>
            {/* Título */}
            <div className="tab-wizard wizard-circle wizard clearfix">
                <div className="steps clearfix">
                    <ul className="tablist">
                        {children.map((child, index) => (
                            <li
                                key={index}
                                className={`${index === indexStep ? "first current" : ""}`}
                            >
                                <a>
                                    <span className="step">{index + 1}</span>
                                    {child.props.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* <ProgressBar now={((step + 1) / steps) * 100} /> */}

                    <div>{children[indexStep]}</div>

                    <div className="mt-3">
                        {/* {step > 0 && <button className="btn btn-secondary rounded" onClick={prevStep}>Voltar</button>} */}
                        {/* {step < steps - 1 && <button className="btn btn-secondary rounded" onClick={nextStep}>Próximo</button>} */}
                    </div>
                </div>
            </div>
        </div>)
    );
};

const Step = ({ name, children }) => {
    return (
        <div>
            {children}
        </div>
    );
};

export { MultiSteps, Step };