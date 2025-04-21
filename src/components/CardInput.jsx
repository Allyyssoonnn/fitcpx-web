import React, { useState, useEffect, useRef } from "react";
import ReactInputMask from "react-input-mask";
import { motion } from 'framer-motion';

const CardInput = ({ submit }) => {
    const [currentCardBackground, setCurrentCardBackground] = useState(Math.floor(Math.random() * 25 + 1));
    const [cardName, setCardName] = useState("Alyson H L Silva");
    const [cardNumber, setCardNumber] = useState("4111111111111111");
    const [cardMonth, setCardMonth] = useState("11");
    const [cardYear, setCardYear] = useState("2030");
    const [cardCvv, setCardCvv] = useState("123");
    const [minCardYear, setMinCardYear] = useState(new Date().getFullYear());
    const [amexCardMask] = useState("9999 999999 99999");
    const [otherCardMask] = useState("9999 9999 9999 9999");
    const [cardNumberTemp, setCardNumberTemp] = useState("");
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [focusElementStyle, setFocusElementStyle] = useState(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [cardType, setcardType] = useState('visa');

    const cardNumberRef = useRef(null);
    const inputRefs = {
      cardName: useRef(null),
      cardNumber: useRef(null),
      cardDate: useRef(null),
      cardCvv: useRef(null),
    };
  
    // Calcula o tipo de cartão com base no número
    const getCardType = () => {
      let number = cardNumber;
      let re = new RegExp("^4");
      if (number.match(re)) return "visa";
  
      re = new RegExp("^(34|37)");
      if (number.match(re)) return "amex";
  
      re = new RegExp("^5[1-5]");
      if (number.match(re)) return "mastercard";
  
      re = new RegExp("^6011");
      if (number.match(re)) return "discover";
  
      re = new RegExp('^9792');
      if (number.match(re)) return 'troy';
  
      return "visa"; // tipo default
    };

    useEffect(() => {
        setcardType(getCardType());
    }, [cardNumber]);
  
    // Gera a máscara do número do cartão com base no tipo de cartão
    const generateCardNumberMask = () => {
        return getCardType() === "amex" ? amexCardMask : otherCardMask;
    };
  
    // Calcula o mês mínimo
    const minCardMonth = () => {
      if (cardYear === minCardYear) return new Date().getMonth() + 1;
      return 1;
    };
  
    // Lida com a mudança de ano do cartão
    useEffect(() => {
      if (cardMonth < minCardMonth()) {
        setCardMonth("");
      }
    }, [cardYear, cardMonth]);
  
    // Efeito para focar no campo de número de cartão assim que o componente for montado
    useEffect(() => {
      if (cardNumberRef.current) {
        cardNumberRef.current.focus();
      }
      setCardNumberTemp(generateCardNumberMask());
    }, []);
  
    // Função para virar o cartão
    const flipCard = (status) => {
      setIsCardFlipped(status);
    };
  
    // Função para lidar com o foco no input
    const focusInput = (e) => {
      setIsInputFocused(true);
      let targetRef = e.target.dataset.ref;
      let target = inputRefs[targetRef].current;
  
      setFocusElementStyle({
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
        transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
      });
    };
  
    // Função para lidar com o blur do input
    const blurInput = () => {
        setFocusElementStyle(null);
    //   setTimeout(() => {
    //     if (!isInputFocused) {
    //       setFocusElementStyle(null);
    //     }
    //   }, 300);
    //   setIsInputFocused(false);
    };

    function finaliza() {
        // Verificar se todos os campos estão preenchidos
        if (!cardNumber || !cardName || !cardMonth || !cardYear || !cardCvv) {
            alert("Por favor, preencha todos os campos antes de finalizar.");
            return;
        }

        // Verificar se o número do cartão tem um formato válido
        const cardNumberRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|9792[0-9]{8})$/;
        if (!cardNumberRegex.test(cardNumber)) {
            alert("Número do cartão inválido.");
            return;
        }

        // Verificar se o nome no cartão tem pelo menos 3 caracteres
        if (cardName.length < 3) {
            alert("Nome no cartão deve ter pelo menos 3 caracteres.");
            return;
        }

        // Verificar se o mês e ano de expiração são válidos
        const currentMonth = new Date().getMonth() + 1; // Mês atual (1-12)
        const currentYear = new Date().getFullYear();  // Ano atual
        if (parseInt(cardYear) < currentYear || (parseInt(cardYear) === currentYear && parseInt(cardMonth) < currentMonth)) {
            alert("A data de expiração do cartão é inválida.");
            return;
        }

        // Verificar se o CVV tem 3 ou 4 dígitos (dependendo do tipo de cartão)
        const isAmex = getCardType() === 'amex';
        const cvvLength = isAmex ? 4 : 3;
        if (cardCvv.length !== cvvLength) {
            alert(`O CVV deve ter ${cvvLength} dígitos.`);
            return;
        }

        // Criar um objeto com todos os dados
        const paymentData = {
            cardNumber: cardNumber.replace(/\s/g, ''),
            cardName: cardName,
            cardMonth: cardMonth,
            cardYear: cardYear,
            cardCvv: cardCvv,
            cardType: getCardType(),
        };

        // Exemplo de como você pode utilizar o objeto (aqui estamos apenas exibindo no console)
        console.log("Dados do pagamento:", paymentData);

        // Se tudo estiver correto, finalize o pagamento
        submit(paymentData);
    }

    return (
        <div className="wrapper p-0" id="app">
            <div className="card-form">
                <div className="card-list">
                    <div className={`card-item ${isCardFlipped ? '-active' : ''}`}>
                        <div className="card-item__side -front">
                            {/* Removido focusElement */}
                            <div className={`card-item__focus ${focusElementStyle ? '-active' : ''}`} style={focusElementStyle}></div>
                            
                            <div className="card-item__cover">
                                <img
                                    src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${currentCardBackground}.jpeg`}
                                    className="card-item__bg"
                                    alt="Card Background"
                                />
                            </div>

                            <div className="card-item__wrapper">
                                <div className="card-item__top">
                                    <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" className="card-item__chip" />
                                    <div className="card-item__type">
                                        <transition name="slide-fade-up">
                                            <img
                                                src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardType}.png`}
                                                alt=""
                                                className="card-item__typeImg"
                                            />
                                        </transition>
                                    </div>
                                </div>

                                <label htmlFor="cardNumber" className="card-item__number" ref={inputRefs.cardNumber}>
                                    <CardNumberDisplay
                                        amexCardMask={amexCardMask}
                                        cardNumber={cardNumber}
                                        otherCardMask={otherCardMask}
                                        getCardType={cardType}
                                    />
                                </label>

                                <div className="card-item__content">
                                    <label htmlFor="cardName" className="card-item__info" ref={inputRefs.cardName}>
                                        <div className="card-item__holder">Nome</div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                            className="card-item__name"
                                        >
                                            {cardName.length > 0 ? (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="slide-fade-right"
                                                >
                                                    {cardName.split("").map((char, index) => (
                                                        <motion.span
                                                            key={index}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="card-item__nameItem"
                                                        >
                                                            {char === " " ? "\u00A0" : char}
                                                        </motion.span>
                                                    ))}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="card-item__name"
                                                >
                                                    Nome completo
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </label>
                                    <div className="card-item__date" ref={inputRefs.cardDate}>
                                        <label htmlFor="cardMonth" className="card-item__dateTitle text-white">
                                            Expiração
                                        </label>
                                        <label htmlFor="cardMonth" className="card-item__dateItem">
                                            <motion.span
                                                key={cardMonth || 'defaultMonth'}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-white"
                                            >
                                                {cardMonth ? cardMonth : 'MM'}
                                            </motion.span>
                                        </label>
                                        /
                                        <label htmlFor="cardYear" className="card-item__dateItem">
                                            <motion.span
                                                key={cardYear || 'defaultYear'}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-white"
                                            >
                                                {cardYear ? String(cardYear).slice(2, 4) : 'YY'}
                                            </motion.span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-item__side -back">
                            <div className="card-item__cover">
                                <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${currentCardBackground}.jpeg`} className="card-item__bg" />
                            </div>

                            <div className="card-item__band"></div>

                            <div className="card-item__cvv">
                                <div className="card-item__cvvTitle">CVV</div>
                                <div className="card-item__cvvBand">
                                    {cardCvv.split("").map((_, index) => (
                                        <span key={index}>*</span>
                                    ))}
                                </div>
                                <div className="card-item__type">
                                    {cardType && (
                                        <img src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardType}.png`} className="card-item__typeImg" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-form__inner">
                    <div className="card-input">
                        <label htmlFor="cardNumber" className="card-input__label form-label">Número do cartão</label>
                        {/* <input type="text" v-model="cardNumber" v-on:focus="focusInput" v-on:blur="blurInput" data-ref="cardNumber" autocomplete="off" /> */}
                        <ReactInputMask value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            id="cardNumber"
                            className="card-input__input"
                            mask={generateCardNumberMask()}
                            onFocus={focusInput}
                            onBlur={blurInput}
                            data-ref='cardNumber'
                        />
                    </div>
                    <div className="card-input">
                        <label htmlFor="cardName" className="card-input__label">Nome no cartão</label>
                        <input value={cardName} onChange={(e) => setCardName(e.target.value)} onBlur={blurInput} onFocus={focusInput} type="text" id="cardName" className="card-input__input" v-model="cardName" v-on:focus="focusInput" v-on:blur="blurInput" data-ref="cardName" autocomplete="off" />
                    </div>
                    <div className="card-form__row">
                        <div className="card-form__col">
                            <div className="card-form__group">
                                <label htmlFor="cardMonth" className="card-input__label">Data de expiração</label>

                                <select value={cardMonth} onChange={e => setCardMonth(e.target.value)} onFocus={focusInput} onBlur={blurInput} className="card-input__input -select" id="cardMonth" v-model="cardMonth" v-on:focus="focusInput" v-on:blur="blurInput" data-ref="cardDate">
                                    <option value="" disabled selected>Mês</option>
                                    {/* <option v-bind:value="n < 10 ? '0' + n : n" v-for="n in 12" v-bind:disabled="n < minCardMonth" v-bind:key="n">
                                        {{n < 10 ? '0' + n : n}}
                                    </option> */}
                                    {[...Array(12)].map((_, index) => {
                                        const month = index + 1;
                                        return (
                                            <option
                                                key={month}
                                                value={month < 10 ? '0' + month : month}
                                                disabled={month < minCardMonth}
                                            >
                                                {month < 10 ? '0' + month : month}
                                            </option>
                                        );
                                    })}
                                </select>
                                <select value={cardYear} onChange={e => setCardYear(e.target.value)} onFocus={focusInput} onBlur={blurInput} className="card-input__input -select" id="cardYear" v-model="cardYear" v-on:focus="focusInput" v-on:blur="blurInput" data-ref="cardDate">
                                    <option value="" disabled selected>Ano</option>
                                    {/* <option v-bind:value="$index + minCardYear" v-for="(n, $index) in 12" v-bind:key="n">
                                        {{$index + minCardYear}}
                                    </option> */}
                                    {[...Array(12)].map((_, index) => {
                                        const year = minCardYear + index;
                                        return (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="card-form__col -cvv">
                            <div className="card-input">
                                <label htmlFor="cardCvv" className="card-input__label">CVV</label>
                                {/* <input onFocus={() => setIsCardFlipped(true)} onBlur={() => setIsCardFlipped(false)} type="text" className="card-input__input" id="cardCvv" v-mask="'####'" maxlength="4" v-model="cardCvv" v-on:focus="flipCard(true)" v-on:blur="flipCard(false)" autocomplete="off" /> */}
                                <ReactInputMask value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    id="cardCvv"
                                    className="card-input__input"
                                    mask={getCardType() == 'amex' ? '9999' : '999'}
                                    onFocus={() => setIsCardFlipped(true)}
                                    onBlur={() => setIsCardFlipped(false)}
                                />
                            </div>
                        </div>
                    </div>

                    <button onClick={finaliza} className="card-form__button btn btn-info rounded">Finalizar pagamento</button>
                </div>
            </div>

            {/* <a href="https://github.com/muhammederdem/credit-card-form" target="_blank" className="github-btn">
                See on GitHub
            </a> */}
        </div>
    )
};

const CardNumberDisplay = ({ getCardType, cardNumber }) => {
    // Função para obter a máscara correta de acordo com o tipo de cartão
    const amexCardMask = ['X', 'X', 'X', 'X', ' ', 'X', 'X', 'X', 'X', 'X', 'X', ' ', 'X', 'X', 'X', 'X', 'X'];
    const otherCardMask = ['X', 'X', 'X', 'X', ' ', 'X', 'X', 'X', 'X', ' ', 'X', 'X', 'X', 'X', ' ', 'X', 'X', 'X', 'X'];
    const mask = getCardType === 'amex' ? amexCardMask : otherCardMask;
  
    return (
        <div>
            {mask.map((n, index) => {
            const isMasked = index > 4 && index < (getCardType === 'amex' ? 14 : 15) && cardNumber.length > index && n.trim() !== '';
            const isActive = n.trim() === '';
            const currentValue = cardNumber.length > index ? cardNumber[index] : '';
    
            return (
                <motion.span key={index} className="card-item__numberItem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {isMasked ? (
                        <div className="card-item__numberItem">
                        *
                        </div>
                    ) : (
                        <>
                        <div className={`card-item__numberItem ${isActive ? '-active' : ''}`}>
                            {currentValue || n}
                        </div>
                        </>
                    )}
                </motion.span>
            );
            })}
        </div>
    );
};

export default CardInput;