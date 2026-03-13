export function Badge({ children, color = "amber" }) {
  const map = {
    amber: { bg: "var(--amber-dim)", c: "var(--amber)" },
    green: { bg: "var(--green-dim)", c: "var(--green)" },
    red: { bg: "var(--red-dim)", c: "var(--red)" },
    blue: { bg: "var(--blue-dim)", c: "var(--blue)" },
    gray: { bg: "rgba(100,100,120,0.15)", c: "var(--text2)" },
  };

  const s = map[color] || map.gray;

  return (
    <span
      style={{
        background: s.bg,
        color: s.c,
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
}
