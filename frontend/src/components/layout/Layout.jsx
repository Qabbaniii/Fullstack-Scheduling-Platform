import { useEffect, useState } from "react";
import { useAuth } from "../../auth/useAuth";
import { Badge } from "../ui/Badge";

export function Layout({ children, currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const isProvider = user?.role === "Provider";
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = isProvider
    ? [
        { id: "services", label: "Services", icon: "◈" },
        { id: "availability", label: "Availability", icon: "◷" },
        { id: "bookings", label: "Bookings", icon: "◻" },
      ]
    : [
        { id: "services", label: "Browse Services", icon: "◈" },
        { id: "bookings", label: "My Bookings", icon: "◻" },
      ];

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const sidebarStyle = {
    width: 260,
    background: "var(--surface)",
    borderRight: "1px solid var(--border)",
    display: "flex",
    flexDirection: "column",
    position: isMobile ? "fixed" : "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 1100,
    transform: isMobile
      ? menuOpen
        ? "translateX(0)"
        : "translateX(-100%)"
      : "translateX(0)",
    transition: "transform 0.28s ease",
    boxShadow: isMobile && menuOpen ? "var(--shadow-lg)" : "none",
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}
    >
      {isMobile && menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1090,
          }}
        />
      )}

      {isMobile && (
        <button
          onClick={() => setMenuOpen(true)}
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            width: 42,
            height: 42,
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            zIndex: 1200,
            cursor: "pointer",
            boxShadow: "var(--shadow)",
          }}
          aria-label="Open menu"
        >
          ☰
        </button>
      )}

      <aside style={sidebarStyle}>
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "var(--amber)",
                  color: "#0e0f13",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                ◈
              </div>
              <span
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: 22,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Schedulr
              </span>
            </div>

            {isMobile && (
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: 20,
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                aria-label="Close menu"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "0 8px 10px",
            }}
          >
            Navigation
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 13px",
                borderRadius: "var(--radius-sm)",
                background:
                  currentPage === item.id ? "var(--amber-dim)" : "transparent",
                color:
                  currentPage === item.id ? "var(--amber)" : "var(--text2)",
                border: "none",
                fontSize: 14,
                fontWeight: currentPage === item.id ? 600 : 500,
                cursor: "pointer",
                marginBottom: 4,
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div
          style={{ padding: "16px 12px", borderTop: "1px solid var(--border)" }}
        >
          <div style={{ padding: "10px 12px", marginBottom: 8 }}>
            <div
              style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}
            >
              {user?.fullName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--text3)",
                marginTop: 3,
                wordBreak: "break-word",
              }}
            >
              {user?.email}
            </div>
            <div style={{ marginTop: 10 }}>
              <Badge color={isProvider ? "amber" : "blue"}>{user?.role}</Badge>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              color: "var(--text3)",
              border: "none",
              fontSize: 13,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            ⎋ Sign out
          </button>
        </div>
      </aside>

      <main
        style={{
          marginLeft: isMobile ? 0 : 260,
          flex: 1,
          padding: isMobile ? "72px 16px 20px" : "36px 32px",
          minHeight: "100vh",
          width: "100%",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        {children}
      </main>
    </div>
  );
}
