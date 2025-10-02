import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que cambie la ruta
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    // También al montar por primera vez (recarga)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return null;
};

export default ScrollToTop;
