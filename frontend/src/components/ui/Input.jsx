export function Input({ label, error, style, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, color: "var(--text2)" }}>{label}</label>
      )}
      <input
        {...props}
        style={{
          background: "var(--surface2)",
          border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
          borderRadius: "var(--radius-sm)",
          padding: "11px 14px",
          color: "var(--text)",
          width: "100%",
          ...style,
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: "var(--red)" }}>{error}</span>
      )}
    </div>
  );
}
