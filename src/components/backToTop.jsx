import { useEffect, useState } from "react";

function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            className={`btn btn-success rounded position-fixed bottom-3 end-3 ${isVisible ? "d-block" : "d-none"}`}
            style={{ zIndex: 1000 }}
            onClick={scrollToTop}
        >
            ↑
        </button>
    );
};

export default BackToTop;