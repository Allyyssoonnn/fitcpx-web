import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

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
      <Button
         className={`position-fixed bottom-15 end-3 ${isVisible ? "d-block" : "d-none"}`}
         style={{ zIndex: 1000 }}
         onClick={scrollToTop}
      >
         <ArrowUp />
      </Button>
   );
}

export default BackToTop;
