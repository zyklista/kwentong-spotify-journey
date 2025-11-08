import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop({ behavior = "auto" }: { behavior?: ScrollBehavior }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, [pathname, behavior]);

  return null;
}
