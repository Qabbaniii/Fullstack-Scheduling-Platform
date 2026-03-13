export function Textarea({ label, style, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text2)" }}>
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "11px 14px",
          color: "var(--text)",
          fontSize: 14,
          outline: "none",
          resize: "vertical",
          minHeight: 90,
          width: "100%",
          ...style,
        }}
      />
    </div>
  );
}
