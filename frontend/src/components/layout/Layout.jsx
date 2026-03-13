import { useAuth } from "../../auth/useAuth";
import { Badge } from "../ui/Badge";

export function Layout({ children, currentPage, setCurrentPage }) {
  const { user, logout } = useAuth();
  const isProvider = user?.role === "Provider";

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

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <aside
        style={{
          width: 260,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              }}
            >
              Schedulr
            </span>
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
              onClick={() => setCurrentPage(item.id)}
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
              {item.label}
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
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 3 }}>
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
          marginLeft: 260,
          flex: 1,
          padding: "36px 32px",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
