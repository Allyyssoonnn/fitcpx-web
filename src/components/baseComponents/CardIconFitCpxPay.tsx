

function CardIconFitCpxPay({ children }) {
    return (
        <div className="d-flex justify-content-between">
            {children}

            <img
                src="/assets/images/logos/FC Pay.png"
                style={{ height: 25 }}
            />
        </div>
    )
}

export default CardIconFitCpxPay;