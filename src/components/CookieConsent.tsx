import { useState } from "react";

const CookieConsent = () => {
  const [accepted, setAccepted] = useState(() => {
    return typeof window !== "undefined" && document.cookie.includes("cookie_consent=true");
  });

  const acceptCookies = () => {
    document.cookie = "cookie_consent=true; path=/; max-age=31536000";
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 12,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#222",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: 8,
      fontSize: "0.85rem",
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      opacity: 0.95
    }}>
      This website uses cookies for security and analytics. <button onClick={acceptCookies} style={{ marginLeft: 8, background: "#fff", color: "#222", border: "none", borderRadius: 4, padding: "2px 8px", fontWeight: "bold", cursor: "pointer", fontSize: "0.85rem" }}>Accept</button>
    </div>
  );
};

export default CookieConsent;
